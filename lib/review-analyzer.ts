import type { Review } from "@/types";

/**
 * Common aspects mentioned in hotel reviews
 */
const ASPECTS = {
  positive: {
    location: [
      "great location",
      "perfect location",
      "convenient location",
      "close to",
      "walking distance",
      "near the",
      "central",
    ],
    cleanliness: [
      "very clean",
      "spotless",
      "immaculate",
      "well maintained",
      "tidy",
    ],
    staff: [
      "friendly staff",
      "helpful staff",
      "great service",
      "excellent service",
      "attentive",
      "professional",
      "welcoming",
    ],
    breakfast: [
      "great breakfast",
      "excellent breakfast",
      "amazing breakfast",
      "good breakfast",
      "breakfast buffet",
      "variety of options",
    ],
    rooms: [
      "spacious room",
      "comfortable bed",
      "modern room",
      "well equipped",
      "nice view",
      "quiet room",
    ],
    value: [
      "great value",
      "worth the price",
      "good value",
      "reasonable price",
      "affordable",
    ],
    amenities: [
      "great pool",
      "nice spa",
      "good gym",
      "rooftop bar",
      "free wifi",
      "parking",
    ],
  },
  negative: {
    noise: [
      "noisy",
      "loud",
      "couldn't sleep",
      "street noise",
      "thin walls",
      "heard everything",
    ],
    cleanliness: [
      "not clean",
      "dirty",
      "dusty",
      "stains",
      "needs cleaning",
      "unhygienic",
    ],
    staff: [
      "rude staff",
      "unfriendly",
      "unhelpful",
      "slow service",
      "ignored",
      "unprofessional",
    ],
    rooms: [
      "small room",
      "tiny room",
      "outdated",
      "needs renovation",
      "worn out",
      "old furniture",
    ],
    bathroom: [
      "small bathroom",
      "no hot water",
      "water pressure",
      "mold",
      "broken shower",
    ],
    value: [
      "overpriced",
      "not worth",
      "expensive",
      "poor value",
      "too expensive",
    ],
    ac: [
      "ac not working",
      "no air conditioning",
      "too hot",
      "too cold",
      "broken ac",
    ],
  },
};

/**
 * Result from highlight/lowlight extraction
 */
export interface InsightsResult {
  highlights: string[];
  lowlights: string[];
}

/**
 * Count how many reviews mention a specific aspect
 */
function countAspectMentions(
  reviews: Review[],
  keywords: string[]
): { count: number; examples: string[] } {
  const matches: string[] = [];

  for (const review of reviews) {
    const text = review.text.toLowerCase();
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        matches.push(review.text);
        break; // Only count each review once per aspect
      }
    }
  }

  return {
    count: matches.length,
    examples: matches.slice(0, 3), // Keep first 3 examples
  };
}

/**
 * Format a percentage as a human-readable frequency
 */
function formatFrequency(count: number, total: number): string {
  const percentage = Math.round((count / total) * 100);
  if (percentage >= 50) return `mentioned by ${percentage}% of guests`;
  if (percentage >= 25) return `frequently mentioned`;
  return `noted by some guests`;
}

/**
 * Extract highlights and lowlights from verified reviews
 * Uses rule-based extraction (MVP - no Claude integration yet)
 */
export function extractHighlightsAndLowlights(
  reviews: Review[]
): InsightsResult {
  if (reviews.length === 0) {
    return { highlights: [], lowlights: [] };
  }

  const highlights: Array<{ aspect: string; count: number; frequency: string }> =
    [];
  const lowlights: Array<{ aspect: string; count: number; frequency: string }> =
    [];

  // Analyze positive aspects
  for (const [aspect, keywords] of Object.entries(ASPECTS.positive)) {
    const { count } = countAspectMentions(reviews, keywords);
    if (count >= 3 || count / reviews.length >= 0.1) {
      highlights.push({
        aspect: formatAspectName(aspect),
        count,
        frequency: formatFrequency(count, reviews.length),
      });
    }
  }

  // Analyze negative aspects
  for (const [aspect, keywords] of Object.entries(ASPECTS.negative)) {
    const { count } = countAspectMentions(reviews, keywords);
    if (count >= 3 || count / reviews.length >= 0.1) {
      lowlights.push({
        aspect: formatAspectName(aspect),
        count,
        frequency: formatFrequency(count, reviews.length),
      });
    }
  }

  // Sort by count (most mentioned first) and take top 5
  highlights.sort((a, b) => b.count - a.count);
  lowlights.sort((a, b) => b.count - a.count);

  return {
    highlights: highlights
      .slice(0, 5)
      .map((h) => `${h.aspect} - ${h.frequency}`),
    lowlights: lowlights
      .slice(0, 5)
      .map((l) => `${l.aspect} - ${l.frequency}`),
  };
}

/**
 * Format aspect name for display
 */
function formatAspectName(aspect: string): string {
  const nameMap: Record<string, string> = {
    location: "Great Location",
    cleanliness: "Cleanliness",
    staff: "Friendly Staff",
    breakfast: "Good Breakfast",
    rooms: "Comfortable Rooms",
    value: "Good Value",
    amenities: "Nice Amenities",
    noise: "Noise Issues",
    bathroom: "Bathroom Issues",
    ac: "AC/Temperature Issues",
  };
  return (
    nameMap[aspect] ||
    aspect.charAt(0).toUpperCase() + aspect.slice(1).replace(/_/g, " ")
  );
}
