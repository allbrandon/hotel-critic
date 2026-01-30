import { ApifyClient } from "apify-client";
import type { Review, Platform } from "@/types";
import { isValidHotelUrl, extractPlaceId } from "./url-validator";

/**
 * Platform rating scales for normalization
 */
const PLATFORM_SCALES: Partial<Record<Platform, number>> = {
  google: 5, // 0-5 scale
  yelp: 5, // 0-5 scale
  tripadvisor: 5, // 0-5 scale (displayed as bubbles)
  booking: 10, // 0-10 scale
  expedia: 10, // 0-10 scale
  hotelscom: 10, // 0-10 scale
  airbnb: 5, // 0-5 scale
};

/**
 * Apify Hotel Review Aggregator response structure
 * Each item in the dataset is a single review
 * See: https://apify.com/tri_angle/hotel-review-aggregator
 */
interface ApifyReviewItem {
  googleMapsPlaceId: string;
  placeName: string;
  placeAlternateNames?: string[];
  placeUrl: string;
  placeAddress: string;
  provider: string; // "google-maps" | "tripadvisor" | "yelp" | "airbnb" | "booking" | "expedia" | "hotels"
  reviewId: string;
  reviewUrl?: string | null;
  reviewTitle?: string | null;
  reviewText: string;
  reviewDate: string;
  reviewRating: string | number;
  authorName: string;
  reviewImages?: string[];
  reviewResponses?: string[];
}

/**
 * Result from fetching hotel reviews
 */
export interface FetchReviewsResult {
  success: boolean;
  hotelName?: string;
  hotelAddress?: string;
  reviews?: Review[];
  platformUrls?: Partial<Record<Platform, string>>;
  error?: string;
  errorCode?: "INVALID_URL" | "APIFY_ERROR" | "NO_REVIEWS";
}

/**
 * Check if mock mode is enabled
 */
function isMockMode(): boolean {
  return process.env.MOCK_APIFY === "true";
}

/**
 * Normalize provider name from Apify response to our Platform type
 * Apify uses: "google-maps", "tripadvisor", "yelp", "airbnb", "booking", "expedia", "hotels"
 */
function normalizeProvider(provider: string): Platform {
  const normalized = provider.toLowerCase().replace(/[^a-z]/g, "");

  const providerMap: Record<string, Platform> = {
    googlemaps: "google",
    google: "google",
    tripadvisor: "tripadvisor",
    booking: "booking",
    bookingcom: "booking",
    expedia: "expedia",
    hotels: "hotelscom",
    hotelscom: "hotelscom",
    yelp: "yelp",
    airbnb: "airbnb",
  };

  return providerMap[normalized] || "google";
}

/**
 * Normalize a rating to 0-10 scale based on platform
 */
function normalizeRating(rating: number, platform: Platform): number {
  const maxScale = PLATFORM_SCALES[platform] || 10;

  // If already on 0-10 scale, return as-is
  if (maxScale === 10) {
    return Math.min(Math.max(rating, 0), 10);
  }

  // Convert to 0-10 scale
  const normalized = (rating / maxScale) * 10;
  return Math.round(normalized * 10) / 10;
}

/**
 * Generate mock reviews for development
 */
function generateMockReviews(platform: Platform, count: number = 30): Review[] {
  const sampleTexts = {
    positive: [
      "Excellent hotel! The room was spacious and clean. Staff were very helpful. Breakfast had great variety.",
      "Perfect location near the train station. Room was modern with great amenities. Would definitely stay again.",
      "Outstanding service from check-in to check-out. The rooftop bar has amazing views of the city.",
      "Very comfortable beds and quiet rooms. The spa facilities were top-notch.",
      "Beautiful property with attention to detail. The concierge helped us book amazing restaurants.",
    ],
    neutral: [
      "Decent hotel for the price. Room was a bit small but clean. Good location for sightseeing.",
      "Average experience overall. Nothing special but nothing bad either. Would consider staying again.",
      "The hotel was okay. Some areas could use renovation but staff were friendly enough.",
      "Met expectations for a mid-range hotel. Breakfast was basic but filling.",
      "Convenient location but rooms are showing their age. Adequate for a short stay.",
    ],
    negative: [
      "Disappointing stay. Room wasn't clean upon arrival and had to wait for housekeeping.",
      "Noise from the street was terrible. Couldn't sleep properly. Not worth the price.",
      "Staff seemed overwhelmed and unhelpful. Check-in took forever. Room was smaller than photos.",
      "AC wasn't working properly. Maintenance took hours to respond. Would not recommend.",
      "Overpriced for what you get. WiFi was slow and breakfast options were limited.",
    ],
    suspicious: [
      "BEST HOTEL EVER!!!! AMAZING!!!!",
      "Perfect. Highly recommend.",
      "Exceeded expectations! Great value!",
      "Nice.",
      "Good hotel highly recommend would stay again exceeded expectations",
    ],
  };

  const reviews: Review[] = [];
  const now = Date.now();
  const maxScale = PLATFORM_SCALES[platform] || 10;

  for (let i = 0; i < count; i++) {
    // Mix of review types: 60% positive, 20% neutral, 15% negative, 5% suspicious
    const rand = Math.random();
    let texts: string[];
    let normalizedRating: number; // Rating on 0-10 scale

    if (rand < 0.6) {
      texts = sampleTexts.positive;
      normalizedRating = 8 + Math.random() * 2; // 8-10
    } else if (rand < 0.8) {
      texts = sampleTexts.neutral;
      normalizedRating = 5 + Math.random() * 2; // 5-7
    } else if (rand < 0.95) {
      texts = sampleTexts.negative;
      normalizedRating = 2 + Math.random() * 3; // 2-5
    } else {
      texts = sampleTexts.suspicious;
      normalizedRating = 9 + Math.random(); // 9-10
    }

    const text = texts[Math.floor(Math.random() * texts.length)];

    // Random date within last 6 months
    const daysAgo = Math.floor(Math.random() * 180);
    const reviewDate = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

    // Convert to platform's native scale for the "original" rating
    const originalRating = (normalizedRating / 10) * maxScale;

    reviews.push({
      id: `mock-${platform}-${i}-${Date.now()}`,
      platform,
      rating: Math.round(originalRating * 10) / 10,
      normalizedRating: Math.round(normalizedRating * 10) / 10,
      text,
      date: reviewDate.toISOString(),
      reviewerName: `Reviewer ${i + 1}`,
      language: "en",
    });
  }

  return reviews;
}

/**
 * Generate mock hotel data for development
 * Simulates aggregated reviews from multiple platforms
 */
function generateMockHotelData(url: string): FetchReviewsResult {
  // Generate reviews from multiple platforms (as the API would aggregate)
  const reviews: Review[] = [
    ...generateMockReviews("google", 35),
    ...generateMockReviews("tripadvisor", 25),
    ...generateMockReviews("booking", 20),
    ...generateMockReviews("expedia", 10),
  ];

  return {
    success: true,
    hotelName: "Mock Hotel - Development Mode",
    hotelAddress: "123 Mock Street, Test City",
    reviews,
    platformUrls: {
      google: url,
      tripadvisor: "https://www.tripadvisor.com/Hotel_Review-mock",
      booking: "https://www.booking.com/hotel/mock",
      expedia: "https://www.expedia.com/hotel/mock",
    },
  };
}

/**
 * Convert Apify review item to our Review format
 */
function convertApifyReview(item: ApifyReviewItem): Review {
  const platform = normalizeProvider(item.provider);
  const rating =
    typeof item.reviewRating === "string"
      ? parseFloat(item.reviewRating)
      : item.reviewRating;
  const normalizedRating = normalizeRating(rating, platform);

  return {
    id: item.reviewId || `${platform}-${Date.now()}-${Math.random()}`,
    platform,
    rating,
    normalizedRating,
    text: item.reviewText || "",
    date: item.reviewDate || new Date().toISOString(),
    reviewerName: item.authorName,
    language: undefined, // Not provided by API
  };
}

/**
 * Fetch hotel reviews from Apify Hotel Review Aggregator
 * Input: Google Maps URL or Place ID
 * Output: Aggregated reviews from multiple platforms
 *
 * API: https://apify.com/tri_angle/hotel-review-aggregator
 */
export async function fetchHotelReviews(
  googleMapsUrl: string
): Promise<FetchReviewsResult> {
  // Validate URL first (must be Google Maps)
  const validation = isValidHotelUrl(googleMapsUrl);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.message,
      errorCode: "INVALID_URL",
    };
  }

  // Use mock data in development
  if (isMockMode()) {
    console.log("[Apify] Using mock mode - returning sample data");
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return generateMockHotelData(googleMapsUrl);
  }

  // Real Apify API call
  const apiToken = process.env.APIFY_API_TOKEN;
  if (!apiToken) {
    return {
      success: false,
      error: "Apify API token not configured",
      errorCode: "APIFY_ERROR",
    };
  }

  try {
    const client = new ApifyClient({ token: apiToken });

    // Extract Place ID if available for more reliable matching
    const placeId = extractPlaceId(googleMapsUrl);

    // Build input for the Actor
    // See: https://apify.com/tri_angle/hotel-review-aggregator#input
    const input: {
      startUrls?: Array<{ url: string }>;
      startIds?: string[];
      scrapeReviewPictures?: boolean;
      scrapeReviewResponses?: boolean;
    } = {
      scrapeReviewPictures: false, // Skip images for performance
      scrapeReviewResponses: false, // Skip owner responses for performance
    };

    // Prefer Place ID if available, otherwise use URL
    if (placeId) {
      input.startIds = [placeId];
    } else {
      input.startUrls = [{ url: validation.normalizedUrl || googleMapsUrl }];
    }

    console.log("[Apify] Calling hotel-review-aggregator with input:", input);

    // Call the hotel-review-aggregator actor
    const run = await client
      .actor("tri_angle/hotel-review-aggregator")
      .call(input);

    // Get results from the dataset
    // Each item is a single review (not a hotel with nested reviews)
    const result = await client.dataset(run.defaultDatasetId).listItems();

    const items = result.items as unknown as ApifyReviewItem[];

    if (!items || items.length === 0) {
      return {
        success: false,
        error: "No reviews found for this hotel",
        errorCode: "NO_REVIEWS",
      };
    }

    // Extract hotel info from first review (all reviews share same hotel data)
    const firstItem = items[0];
    const hotelName = firstItem.placeName;
    const hotelAddress = firstItem.placeAddress;

    // Convert all reviews to our format
    const reviews = items.map(convertApifyReview);

    // Build platform URLs from review data
    const platformUrls: Partial<Record<Platform, string>> = {};
    for (const item of items) {
      if (item.placeUrl) {
        const platform = normalizeProvider(item.provider);
        // Only set if not already set (first occurrence wins)
        if (!platformUrls[platform]) {
          platformUrls[platform] = item.placeUrl;
        }
      }
    }
    // Always include the original Google Maps URL
    platformUrls.google = googleMapsUrl;

    console.log(
      `[Apify] Fetched ${reviews.length} reviews from ${Object.keys(platformUrls).length} platforms`
    );

    return {
      success: true,
      hotelName,
      hotelAddress,
      reviews,
      platformUrls,
    };
  } catch (error) {
    console.error("[Apify] Error fetching reviews:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch reviews",
      errorCode: "APIFY_ERROR",
    };
  }
}

/**
 * Estimate cost for an Apify API call
 * Based on pay-per-event pricing
 */
export function estimateApifyCost(reviewCount: number): number {
  // Rough estimate based on Apify pricing
  const baseRate = 0.0004; // $ per review
  return Math.round(reviewCount * baseRate * 100) / 100;
}
