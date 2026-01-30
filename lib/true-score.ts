import type {
  Review,
  Platform,
  TrueScoreResult,
  ConfidenceLevel,
  EdgeCaseWarning,
  EdgeCaseStatus,
  PlatformData,
} from "@/types";
import { filterSuspiciousReviews } from "./review-filter";

/**
 * Minimum reviews required for analysis
 */
const MIN_TOTAL_REVIEWS = 25;
const MIN_VERIFIED_REVIEWS = 15;
const HIGH_FAKE_RATE_THRESHOLD = 0.7; // 70%

/**
 * Platform rating scale configurations
 */
const PLATFORM_SCALES: Record<Platform, { max: number; multiplier: number }> = {
  google: { max: 5, multiplier: 2 }, // 0-5 scale → multiply by 2
  tripadvisor: { max: 5, multiplier: 2 }, // 0-5 scale (bubbles) → multiply by 2
  booking: { max: 10, multiplier: 1 }, // 0-10 scale
  expedia: { max: 10, multiplier: 1 }, // 0-10 scale
  hotelscom: { max: 10, multiplier: 1 }, // 0-10 scale
  yelp: { max: 5, multiplier: 2 }, // 0-5 scale → multiply by 2
  airbnb: { max: 5, multiplier: 2 }, // 0-5 scale → multiply by 2
};

/**
 * Platform credibility weights
 */
const PLATFORM_WEIGHTS: Record<Platform, number> = {
  google: 1.0,
  tripadvisor: 1.1, // Well-established travel platform
  booking: 1.2, // Verified stays
  expedia: 1.1, // Verified bookings
  hotelscom: 1.1, // Verified bookings
  yelp: 1.0,
  airbnb: 1.0,
};

/**
 * Recency weight tiers (days)
 */
const RECENCY_TIERS = {
  recent: { maxDays: 90, weight: 2.0 }, // 0-3 months
  moderate: { maxDays: 180, weight: 1.5 }, // 3-6 months
  old: { maxDays: Infinity, weight: 1.0 }, // 6+ months
};

/**
 * Normalize a rating to 0-10 scale based on platform
 */
export function normalizeRating(rating: number, platform: Platform): number {
  const config = PLATFORM_SCALES[platform];
  if (!config) return rating;

  // Clamp to valid range first
  const clamped = Math.max(0, Math.min(rating, config.max));

  // Apply multiplier to normalize to 0-10
  return clamped * config.multiplier;
}

/**
 * Calculate recency weight based on review date
 */
export function getRecencyWeight(reviewDate: string): number {
  const now = Date.now();
  const reviewTime = new Date(reviewDate).getTime();
  const daysOld = Math.floor((now - reviewTime) / (1000 * 60 * 60 * 24));

  if (daysOld <= RECENCY_TIERS.recent.maxDays) {
    return RECENCY_TIERS.recent.weight;
  } else if (daysOld <= RECENCY_TIERS.moderate.maxDays) {
    return RECENCY_TIERS.moderate.weight;
  } else {
    return RECENCY_TIERS.old.weight;
  }
}

/**
 * Calculate specificity weight based on review content
 * Longer, more detailed reviews get slight bonus
 */
export function getSpecificityWeight(review: Review): number {
  const text = review.text || "";
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;

  // Very detailed reviews (100+ words) get 1.1x
  if (wordCount >= 100) return 1.1;
  // Moderately detailed (50-99 words) get 1.05x
  if (wordCount >= 50) return 1.05;
  // Standard weight
  return 1.0;
}

/**
 * Get confidence level based on verified review count
 */
export function getConfidenceLevel(verifiedCount: number): ConfidenceLevel {
  if (verifiedCount > 100) return "high";
  if (verifiedCount >= 50) return "medium";
  return "low";
}

/**
 * Check if all reviews are older than a threshold
 */
export function areAllReviewsOutdated(
  reviews: Review[],
  thresholdDays: number = 365
): boolean {
  if (reviews.length === 0) return false;

  const now = Date.now();
  return reviews.every((review) => {
    if (!review.date) return true;
    const daysOld = Math.floor(
      (now - new Date(review.date).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysOld > thresholdDays;
  });
}

/**
 * Get unique platforms from reviews
 */
export function getUniquePlatforms(reviews: Review[]): Set<Platform> {
  return new Set(reviews.map((r) => r.platform));
}

/**
 * True Score calculation result with full details
 */
export interface TrueScoreCalculation {
  success: boolean;
  score?: number;
  confidence?: ConfidenceLevel;
  totalReviews: number;
  verifiedReviews: number;
  filteredReviews: number;
  filterPercentage: number;
  platformBreakdown: Map<Platform, PlatformData>;
  warnings: EdgeCaseWarning[];
  error?: EdgeCaseStatus;
  errorMessage?: string;
}

/**
 * Calculate the True Score from a set of reviews
 */
export function calculateTrueScore(reviews: Review[]): TrueScoreCalculation {
  const warnings: EdgeCaseWarning[] = [];

  // Check minimum total reviews
  if (reviews.length < MIN_TOTAL_REVIEWS) {
    return {
      success: false,
      totalReviews: reviews.length,
      verifiedReviews: 0,
      filteredReviews: 0,
      filterPercentage: 0,
      platformBreakdown: new Map(),
      warnings: [],
      error: "insufficient_reviews",
      errorMessage: `This hotel doesn't have enough reviews yet for a reliable True Score. Found ${reviews.length} reviews, need at least ${MIN_TOTAL_REVIEWS}.`,
    };
  }

  // Filter suspicious reviews
  const { verified, filtered, stats } = filterSuspiciousReviews(reviews);

  // Check for high fake rate
  if (stats.filterPercentage > HIGH_FAKE_RATE_THRESHOLD * 100) {
    warnings.push({
      status: "high_fake_rate",
      message: `Many suspicious reviews detected (${stats.filterPercentage}% filtered) - score may be unreliable.`,
    });
  }

  // Check minimum verified reviews after filtering
  if (verified.length < MIN_VERIFIED_REVIEWS) {
    return {
      success: false,
      totalReviews: reviews.length,
      verifiedReviews: verified.length,
      filteredReviews: filtered.length,
      filterPercentage: stats.filterPercentage,
      platformBreakdown: new Map(),
      warnings,
      error: "insufficient_verified",
      errorMessage: `Not enough verified reviews after filtering. Found ${verified.length} verified reviews, need at least ${MIN_VERIFIED_REVIEWS}.`,
    };
  }

  // Check for single platform
  const platforms = getUniquePlatforms(verified);
  if (platforms.size === 1) {
    const platform = Array.from(platforms)[0];
    warnings.push({
      status: "single_platform",
      message: `Limited to ${platform} reviews only - confidence reduced.`,
    });
  }

  // Check for outdated reviews
  if (areAllReviewsOutdated(verified)) {
    warnings.push({
      status: "outdated_reviews",
      message: "All reviews are over 1 year old - information may be outdated.",
    });
  }

  // Calculate weighted score
  let totalWeight = 0;
  let weightedSum = 0;
  const platformBreakdown = new Map<Platform, PlatformData>();

  // Initialize platform data
  for (const platform of platforms) {
    platformBreakdown.set(platform, {
      platform,
      originalScore: 0,
      normalizedScore: 0,
      totalReviews: 0,
      verifiedReviews: 0,
      filteredReviews: 0,
      url: "",
    });
  }

  // Process each verified review
  for (const review of verified) {
    // Normalize rating
    const normalizedRating = normalizeRating(
      review.rating,
      review.platform
    );

    // Calculate combined weight
    const recencyWeight = getRecencyWeight(review.date);
    const platformWeight = PLATFORM_WEIGHTS[review.platform] || 1.0;
    const specificityWeight = getSpecificityWeight(review);

    const combinedWeight = recencyWeight * platformWeight * specificityWeight;

    weightedSum += normalizedRating * combinedWeight;
    totalWeight += combinedWeight;

    // Update platform breakdown
    const platformData = platformBreakdown.get(review.platform)!;
    platformData.totalReviews++;
    platformData.verifiedReviews++;
  }

  // Count filtered reviews per platform
  for (const review of filtered) {
    const platformData = platformBreakdown.get(review.platform);
    if (platformData) {
      platformData.filteredReviews++;
      platformData.totalReviews++;
    }
  }

  // Calculate platform scores
  for (const [platform, data] of platformBreakdown) {
    const platformReviews = verified.filter((r) => r.platform === platform);
    if (platformReviews.length > 0) {
      const avgRating =
        platformReviews.reduce((sum, r) => sum + r.rating, 0) /
        platformReviews.length;
      data.originalScore = Math.round(avgRating * 10) / 10;
      data.normalizedScore =
        Math.round(normalizeRating(avgRating, platform) * 10) / 10;
    }
  }

  // Calculate final score
  const rawScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const finalScore = Math.round(rawScore * 10) / 10; // Round to 1 decimal

  return {
    success: true,
    score: finalScore,
    confidence: getConfidenceLevel(verified.length),
    totalReviews: reviews.length,
    verifiedReviews: verified.length,
    filteredReviews: filtered.length,
    filterPercentage: stats.filterPercentage,
    platformBreakdown,
    warnings,
  };
}

/**
 * Get color code for True Score display
 */
export function getScoreColor(
  score: number
): "excellent" | "good" | "average" | "poor" {
  if (score >= 8.0) return "excellent";
  if (score >= 6.0) return "good";
  if (score >= 4.0) return "average";
  return "poor";
}

/**
 * Format True Score for display
 */
export function formatTrueScore(score: number): string {
  return score.toFixed(1);
}
