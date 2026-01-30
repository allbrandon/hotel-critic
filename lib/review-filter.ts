import type { Review } from "@/types";

/**
 * Generic phrases commonly found in fake reviews
 */
const GENERIC_PHRASES = [
  "exceeded expectations",
  "highly recommend",
  "great value for money",
  "would definitely stay again",
  "best hotel ever",
  "absolutely perfect",
  "couldn't ask for more",
  "five star experience",
  "world class service",
  "hidden gem",
  "exceeded all expectations",
  "perfect in every way",
  "nothing negative to say",
  "flawless experience",
  "dream come true",
];

/**
 * Result of pre-filtering a review
 */
export interface FilterResult {
  review: Review;
  flagged: boolean;
  suspicionScore: number;
  reasons: string[];
}

/**
 * Check if review text is too short (< 20 characters)
 */
export function isShortReview(text: string): boolean {
  const trimmed = text?.trim() || "";
  return trimmed.length < 20;
}

/**
 * Check if review has excessive capitalization (> 80% caps)
 */
export function hasExcessiveCaps(text: string): boolean {
  if (!text || text.length < 10) return false;

  const letters = text.match(/[A-Za-z]/g) || [];
  if (letters.length < 10) return false;

  const upperCase = text.match(/[A-Z]/g) || [];
  const ratio = upperCase.length / letters.length;

  return ratio > 0.8;
}

/**
 * Check if review has excessive punctuation (> 5 consecutive ! or ?)
 */
export function hasExcessivePunctuation(text: string): boolean {
  if (!text) return false;

  const exclamations = (text.match(/!/g) || []).length;
  const questions = (text.match(/\?/g) || []).length;

  // More than 5 of either, or multiple consecutive
  return (
    exclamations > 5 ||
    questions > 5 ||
    /[!]{3,}/.test(text) ||
    /[?]{3,}/.test(text)
  );
}

/**
 * Count generic phrases in review text
 */
export function countGenericPhrases(text: string): {
  count: number;
  found: string[];
} {
  if (!text) return { count: 0, found: [] };

  const lowerText = text.toLowerCase();
  const found = GENERIC_PHRASES.filter((phrase) =>
    lowerText.includes(phrase.toLowerCase())
  );

  return { count: found.length, found };
}

/**
 * Check for spam patterns in review
 */
export function hasSpamPatterns(text: string): {
  allCaps: boolean;
  excessivePunctuation: boolean;
  tooShort: boolean;
  genericPhrases: number;
} {
  return {
    allCaps: hasExcessiveCaps(text),
    excessivePunctuation: hasExcessivePunctuation(text),
    tooShort: isShortReview(text),
    genericPhrases: countGenericPhrases(text).count,
  };
}

/**
 * Find duplicate reviews (same reviewer, same day)
 */
export function findDuplicateReviews(reviews: Review[]): Set<string> {
  const duplicateIds = new Set<string>();
  const seenReviewers = new Map<string, Review>();

  for (const review of reviews) {
    if (!review.reviewerName || !review.date) continue;

    const dateKey = review.date.split("T")[0]; // Just the date part
    const key = `${review.reviewerName.toLowerCase()}_${dateKey}`;

    if (seenReviewers.has(key)) {
      // Both the original and this one are duplicates
      const original = seenReviewers.get(key)!;
      duplicateIds.add(original.id);
      duplicateIds.add(review.id);
    } else {
      seenReviewers.set(key, review);
    }
  }

  return duplicateIds;
}

/**
 * Detect review bursts (many reviews in short period)
 * @param reviews - Array of reviews to check
 * @param windowDays - Time window to check (default 7 days)
 * @param threshold - Number of reviews to trigger detection (default 15)
 */
export function detectReviewBurst(
  reviews: Review[],
  windowDays: number = 7,
  threshold: number = 15
): { detected: boolean; count: number; startDate?: string; endDate?: string } {
  if (reviews.length < threshold) {
    return { detected: false, count: 0 };
  }

  // Sort by date
  const sorted = [...reviews]
    .filter((r) => r.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (sorted.length < threshold) {
    return { detected: false, count: 0 };
  }

  const windowMs = windowDays * 24 * 60 * 60 * 1000;

  // Sliding window to find burst
  for (let i = 0; i <= sorted.length - threshold; i++) {
    const startTime = new Date(sorted[i].date).getTime();
    const endTime = new Date(sorted[i + threshold - 1].date).getTime();

    if (endTime - startTime <= windowMs) {
      return {
        detected: true,
        count: threshold,
        startDate: sorted[i].date,
        endDate: sorted[i + threshold - 1].date,
      };
    }
  }

  return { detected: false, count: 0 };
}

/**
 * Calculate suspicion score for a single review (0-100)
 * Higher score = more suspicious
 */
export function calculateSuspicionScore(review: Review): number {
  let score = 0;
  const reasons: string[] = [];

  const text = review.text || "";

  // Short review: +30 points
  if (isShortReview(text)) {
    score += 30;
    reasons.push("short_review");
  }

  // All caps: +25 points
  if (hasExcessiveCaps(text)) {
    score += 25;
    reasons.push("all_caps");
  }

  // Excessive punctuation: +20 points
  if (hasExcessivePunctuation(text)) {
    score += 20;
    reasons.push("excessive_punctuation");
  }

  // Generic phrases: +10 points per phrase (max 30)
  const { count: genericCount } = countGenericPhrases(text);
  if (genericCount > 0) {
    score += Math.min(genericCount * 10, 30);
    reasons.push("generic_phrases");
  }

  // Extreme rating without detail: +15 points
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  if (
    (review.normalizedRating >= 9.5 || review.normalizedRating <= 1) &&
    wordCount < 20
  ) {
    score += 15;
    reasons.push("extreme_rating_no_detail");
  }

  // Cap at 100
  return Math.min(score, 100);
}

/**
 * Pre-filter reviews using rule-based detection
 * Returns reviews with suspicion scores and flag reasons
 */
export function preFilterReviews(reviews: Review[]): FilterResult[] {
  // Find duplicates across all reviews first
  const duplicateIds = findDuplicateReviews(reviews);

  return reviews.map((review) => {
    let suspicionScore = calculateSuspicionScore(review);
    const reasons: string[] = [];

    // Check individual review issues
    if (isShortReview(review.text)) reasons.push("short_review");
    if (hasExcessiveCaps(review.text)) reasons.push("all_caps");
    if (hasExcessivePunctuation(review.text))
      reasons.push("excessive_punctuation");

    const { count: genericCount, found } = countGenericPhrases(review.text);
    if (genericCount >= 2) reasons.push("multiple_generic_phrases");
    else if (genericCount === 1) reasons.push("generic_phrase");

    // Add duplicate penalty
    if (duplicateIds.has(review.id)) {
      suspicionScore += 30;
      reasons.push("duplicate_review");
    }

    // Cap score at 100
    suspicionScore = Math.min(suspicionScore, 100);

    return {
      review: {
        ...review,
        suspicionScore,
        flaggedReasons: reasons,
      },
      flagged: suspicionScore > 60,
      suspicionScore,
      reasons,
    };
  });
}

/**
 * Filter out suspicious reviews and return verified ones
 * @param reviews - Reviews to filter
 * @param threshold - Suspicion score threshold (default 60)
 */
export function filterSuspiciousReviews(
  reviews: Review[],
  threshold: number = 60
): { verified: Review[]; filtered: Review[]; stats: FilterStats } {
  const results = preFilterReviews(reviews);

  const verified: Review[] = [];
  const filtered: Review[] = [];

  for (const result of results) {
    if (result.suspicionScore > threshold) {
      filtered.push(result.review);
    } else {
      verified.push(result.review);
    }
  }

  return {
    verified,
    filtered,
    stats: {
      total: reviews.length,
      verified: verified.length,
      filtered: filtered.length,
      filterPercentage:
        reviews.length > 0
          ? Math.round((filtered.length / reviews.length) * 100)
          : 0,
    },
  };
}

export interface FilterStats {
  total: number;
  verified: number;
  filtered: number;
  filterPercentage: number;
}
