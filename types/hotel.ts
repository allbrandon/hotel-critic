/**
 * Review source platforms aggregated by Apify
 * Input: Google Maps URL
 * Output: Reviews from these platforms
 */
export type Platform =
  | "google"      // Google Maps reviews
  | "tripadvisor" // TripAdvisor reviews
  | "booking"     // Booking.com reviews
  | "expedia"     // Expedia reviews
  | "hotelscom"   // Hotels.com reviews
  | "yelp"        // Yelp reviews
  | "airbnb";     // Airbnb reviews

/**
 * Individual review from a platform
 */
export interface Review {
  id: string;
  platform: Platform;
  rating: number; // Original rating (varies by platform scale)
  normalizedRating: number; // Normalized to 0-10 scale
  text: string;
  date: string; // ISO date string
  reviewerName?: string;
  language?: string;
  // AI analysis results
  suspicionScore?: number; // 0-100, higher = more suspicious
  flaggedReasons?: string[];
}

/**
 * Aggregated data from a single platform
 */
export interface PlatformData {
  platform: Platform;
  originalScore: number; // Platform's original score
  normalizedScore: number; // Normalized to 0-10
  totalReviews: number;
  verifiedReviews: number; // Reviews that passed filtering
  filteredReviews: number; // Reviews flagged as suspicious
  url: string; // Link back to platform
}

/**
 * Hotel information
 */
export interface Hotel {
  name: string;
  address?: string;
  url: string; // Original URL provided by user
  platforms: PlatformData[];
}

/**
 * AI-generated highlight or lowlight
 */
export interface Insight {
  aspect: string; // e.g., "Breakfast Quality", "Location"
  description: string; // Natural language description
  frequency?: string; // e.g., "mentioned by 78% of guests"
  sentiment: "positive" | "negative";
}

/**
 * Confidence level for True Score
 */
export type ConfidenceLevel = "high" | "medium" | "low";

/**
 * True Score calculation result
 */
export interface TrueScoreResult {
  score: number; // 0-10 scale
  confidence: ConfidenceLevel;
  totalReviews: number;
  verifiedReviews: number;
  filteredReviews: number;
  filterPercentage: number; // Percentage of reviews filtered
}

/**
 * Edge case status for hotels that can't be scored
 */
export type EdgeCaseStatus =
  | "insufficient_reviews" // <25 total reviews
  | "insufficient_verified" // <15 reviews after filtering
  | "high_fake_rate" // >70% filtered
  | "single_platform" // Only one platform available
  | "outdated_reviews"; // All reviews >1 year old

/**
 * Warning message for edge cases
 */
export interface EdgeCaseWarning {
  status: EdgeCaseStatus;
  message: string;
}
