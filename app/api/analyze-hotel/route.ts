import { NextRequest, NextResponse } from "next/server";
import type {
  AnalyzeHotelRequest,
  AnalyzeHotelResponse,
  AnalyzeHotelError,
  PlatformBreakdown,
  BookingLinks,
} from "@/types/api";
import type { Platform } from "@/types";
import { isValidHotelUrl } from "@/lib/url-validator";
import { fetchHotelReviews } from "@/lib/apify-client";
import { calculateTrueScore } from "@/lib/true-score";
import { extractHighlightsAndLowlights } from "@/lib/review-analyzer";

/**
 * POST /api/analyze-hotel
 * Analyzes a hotel from a Google Maps URL and returns True Score
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = (await request.json()) as AnalyzeHotelRequest;
    const { hotelUrl } = body;

    // Validate URL
    if (!hotelUrl || typeof hotelUrl !== "string") {
      return NextResponse.json<AnalyzeHotelError>(
        {
          success: false,
          error: "Hotel URL is required",
          code: "INVALID_URL",
        },
        { status: 400 }
      );
    }

    // Validate Google Maps URL format
    const validation = isValidHotelUrl(hotelUrl);
    if (!validation.valid) {
      return NextResponse.json<AnalyzeHotelError>(
        {
          success: false,
          error: validation.message || "Invalid URL format",
          code:
            validation.error === "UNSUPPORTED_PLATFORM"
              ? "UNSUPPORTED_PLATFORM"
              : "INVALID_URL",
        },
        { status: 400 }
      );
    }

    // Fetch reviews from Apify
    const reviewsResult = await fetchHotelReviews(hotelUrl);

    if (!reviewsResult.success || !reviewsResult.reviews) {
      return NextResponse.json<AnalyzeHotelError>(
        {
          success: false,
          error: reviewsResult.error || "Failed to fetch reviews",
          code:
            reviewsResult.errorCode === "NO_REVIEWS"
              ? "INSUFFICIENT_DATA"
              : "APIFY_ERROR",
        },
        { status: reviewsResult.errorCode === "NO_REVIEWS" ? 400 : 500 }
      );
    }

    // Calculate True Score
    const scoreResult = calculateTrueScore(reviewsResult.reviews);

    if (!scoreResult.success || scoreResult.score === undefined) {
      return NextResponse.json<AnalyzeHotelError>(
        {
          success: false,
          error: scoreResult.errorMessage || "Unable to calculate score",
          code: "INSUFFICIENT_DATA",
        },
        { status: 400 }
      );
    }

    // Extract highlights and lowlights from verified reviews
    const { verified } = await import("@/lib/review-filter").then((m) =>
      m.filterSuspiciousReviews(reviewsResult.reviews!)
    );
    const insights = extractHighlightsAndLowlights(verified);

    // Build platform breakdown
    const platforms: Record<string, PlatformBreakdown> = {};
    for (const [platform, data] of scoreResult.platformBreakdown) {
      platforms[platform] = {
        score: data.normalizedScore,
        reviews: data.totalReviews,
        verified: data.verifiedReviews,
      };
    }

    // Build booking links from platform URLs
    const bookingLinks: BookingLinks = reviewsResult.platformUrls || {};

    // Build response
    const response: AnalyzeHotelResponse = {
      success: true,
      trueScore: scoreResult.score,
      confidence: scoreResult.confidence!,
      dataFreshness: new Date().toISOString(),
      cached: false,
      platforms,
      totalReviews: scoreResult.totalReviews,
      filteredReviews: scoreResult.filteredReviews,
      highlights: insights.highlights,
      lowlights: insights.lowlights,
      bookingLinks,
      warnings:
        scoreResult.warnings.length > 0 ? scoreResult.warnings : undefined,
    };

    return NextResponse.json<AnalyzeHotelResponse>(response);
  } catch (error) {
    console.error("[API] Error analyzing hotel:", error);

    return NextResponse.json<AnalyzeHotelError>(
      {
        success: false,
        error: "An unexpected error occurred",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
