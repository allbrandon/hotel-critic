import type {
  ConfidenceLevel,
  EdgeCaseWarning,
  Insight,
  Platform,
  PlatformData,
} from "./hotel";

/**
 * Request body for /api/analyze-hotel
 */
export interface AnalyzeHotelRequest {
  hotelUrl: string;
}

/**
 * Platform data in API response
 */
export interface PlatformBreakdown {
  score: number; // Normalized 0-10
  reviews: number; // Total reviews
  verified: number; // Verified reviews count
}

/**
 * Booking links in API response
 */
export type BookingLinks = Partial<Record<Platform, string>>;

/**
 * Successful analysis response from /api/analyze-hotel
 */
export interface AnalyzeHotelResponse {
  success: true;
  // True Score data
  trueScore: number;
  confidence: ConfidenceLevel;
  dataFreshness: string; // ISO timestamp
  cached: boolean;

  // Platform breakdown
  platforms: Record<string, PlatformBreakdown>;

  // Review statistics
  totalReviews: number;
  filteredReviews: number;

  // AI-generated insights
  highlights: string[];
  lowlights: string[];

  // Booking links
  bookingLinks: BookingLinks;

  // Optional warnings for edge cases
  warnings?: EdgeCaseWarning[];
}

/**
 * Error response from /api/analyze-hotel
 */
export interface AnalyzeHotelError {
  success: false;
  error: string;
  code: AnalyzeHotelErrorCode;
}

/**
 * Error codes for API responses
 */
export type AnalyzeHotelErrorCode =
  | "INVALID_URL" // URL format invalid
  | "UNSUPPORTED_PLATFORM" // Platform not supported
  | "APIFY_ERROR" // Apify API failed
  | "CLAUDE_ERROR" // Claude API failed
  | "INSUFFICIENT_DATA" // Not enough reviews
  | "RATE_LIMITED" // Too many requests
  | "BUDGET_CAP_REACHED" // Daily budget exceeded
  | "INTERNAL_ERROR"; // Unknown error

/**
 * Union type for all API responses
 */
export type AnalyzeHotelResult = AnalyzeHotelResponse | AnalyzeHotelError;

/**
 * Loading states for UI
 */
export type AnalysisStep =
  | "idle"
  | "validating"
  | "checking_cache"
  | "fetching_reviews"
  | "analyzing_reviews"
  | "calculating_score"
  | "complete"
  | "error";

/**
 * Loading progress for UI display
 */
export interface AnalysisProgress {
  step: AnalysisStep;
  message: string;
  percentage: number;
}

/**
 * Step descriptions for UI
 */
export const ANALYSIS_STEPS: Record<AnalysisStep, AnalysisProgress> = {
  idle: { step: "idle", message: "Ready to analyze", percentage: 0 },
  validating: { step: "validating", message: "Validating URL...", percentage: 5 },
  checking_cache: {
    step: "checking_cache",
    message: "Checking cache...",
    percentage: 10,
  },
  fetching_reviews: {
    step: "fetching_reviews",
    message: "Fetching reviews from platforms...",
    percentage: 30,
  },
  analyzing_reviews: {
    step: "analyzing_reviews",
    message: "Analyzing reviews with AI...",
    percentage: 60,
  },
  calculating_score: {
    step: "calculating_score",
    message: "Calculating True Score...",
    percentage: 90,
  },
  complete: { step: "complete", message: "Analysis complete!", percentage: 100 },
  error: { step: "error", message: "An error occurred", percentage: 0 },
};
