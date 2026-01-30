import { describe, it, expect } from "vitest";
import type { Review, Platform } from "@/types";
import {
  isShortReview,
  hasExcessiveCaps,
  hasExcessivePunctuation,
  countGenericPhrases,
  hasSpamPatterns,
  findDuplicateReviews,
  detectReviewBurst,
  calculateSuspicionScore,
  preFilterReviews,
  filterSuspiciousReviews,
} from "../review-filter";

/**
 * Test suite for Review Filter (fake review detection)
 */

// Helper to create mock review
function createMockReview(overrides: Partial<Review> = {}): Review {
  return {
    id: Math.random().toString(36).substring(7),
    platform: "booking" as Platform,
    rating: 8.0,
    normalizedRating: 8.0,
    text: "The hotel was very nice with clean rooms and friendly staff. The location was perfect.",
    date: new Date().toISOString(),
    reviewerName: "John D.",
    ...overrides,
  };
}

describe("Review Pre-Filtering", () => {
  describe("Short Review Detection", () => {
    it("should flag reviews with < 20 characters", () => {
      expect(isShortReview("Nice hotel!")).toBe(true);
    });

    it("should not flag reviews with >= 20 characters", () => {
      expect(
        isShortReview("This hotel was great and I would recommend it to anyone.")
      ).toBe(false);
    });

    it("should handle empty reviews", () => {
      expect(isShortReview("")).toBe(true);
    });

    it("should handle whitespace-only reviews", () => {
      expect(isShortReview("   \n\t   ")).toBe(true);
    });
  });

  describe("Excessive Caps Detection", () => {
    it("should flag reviews with ALL CAPS", () => {
      expect(
        hasExcessiveCaps("THIS HOTEL IS AMAZING AND EVERYONE SHOULD STAY HERE")
      ).toBe(true);
    });

    it("should not flag reviews with normal capitalization", () => {
      expect(
        hasExcessiveCaps("This hotel was great. The staff were friendly and helpful.")
      ).toBe(false);
    });

    it("should handle mixed case properly", () => {
      expect(
        hasExcessiveCaps("The BREAKFAST was amazing but rooms were just OK.")
      ).toBe(false);
    });

    it("should handle short text", () => {
      expect(hasExcessiveCaps("OK")).toBe(false);
    });
  });

  describe("Excessive Punctuation Detection", () => {
    it("should flag reviews with excessive exclamation marks", () => {
      expect(
        hasExcessivePunctuation("Amazing!!! Best hotel ever!!!! Loved it so much!!!!")
      ).toBe(true);
    });

    it("should not flag reviews with normal punctuation", () => {
      expect(
        hasExcessivePunctuation("Great hotel! The staff were very helpful. Would recommend.")
      ).toBe(false);
    });

    it("should flag reviews with excessive question marks", () => {
      expect(
        hasExcessivePunctuation("Why would anyone stay here??? How is this hotel still open???")
      ).toBe(true);
    });
  });

  describe("Generic Phrase Detection", () => {
    it("should detect multiple generic phrases", () => {
      const result = countGenericPhrases(
        "This hotel exceeded expectations! I highly recommend it. Great value for money!"
      );
      expect(result.count).toBeGreaterThanOrEqual(2);
    });

    it("should not flag reviews with specific details", () => {
      const result = countGenericPhrases(
        "Room 512 had a great view of the harbor. The breakfast buffet had fresh croissants."
      );
      expect(result.count).toBe(0);
    });

    it("should detect single generic phrase", () => {
      const result = countGenericPhrases(
        "The hotel was clean and staff were friendly. I highly recommend it."
      );
      expect(result.count).toBe(1);
    });
  });

  describe("Spam Pattern Detection", () => {
    it("should detect multiple spam patterns", () => {
      const patterns = hasSpamPatterns("BEST HOTEL EVER!!!! HIGHLY RECOMMEND!!!!");
      expect(patterns.allCaps).toBe(true);
      expect(patterns.excessivePunctuation).toBe(true);
    });

    it("should pass clean reviews", () => {
      const patterns = hasSpamPatterns(
        "The hotel was clean and the location was convenient. Staff were helpful."
      );
      expect(patterns.allCaps).toBe(false);
      expect(patterns.excessivePunctuation).toBe(false);
      expect(patterns.tooShort).toBe(false);
    });
  });

  describe("Duplicate Review Detection", () => {
    it("should flag reviews from same reviewer on same day", () => {
      const today = new Date().toISOString();
      const reviews = [
        createMockReview({ id: "1", reviewerName: "John D.", date: today }),
        createMockReview({ id: "2", reviewerName: "John D.", date: today }),
      ];

      const duplicates = findDuplicateReviews(reviews);
      expect(duplicates.size).toBe(2);
    });

    it("should not flag reviews from same reviewer on different days", () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      const today = new Date().toISOString();
      const reviews = [
        createMockReview({ id: "1", reviewerName: "John D.", date: yesterday }),
        createMockReview({ id: "2", reviewerName: "John D.", date: today }),
      ];

      const duplicates = findDuplicateReviews(reviews);
      expect(duplicates.size).toBe(0);
    });

    it("should not flag reviews from different reviewers on same day", () => {
      const today = new Date().toISOString();
      const reviews = [
        createMockReview({ id: "1", reviewerName: "John D.", date: today }),
        createMockReview({ id: "2", reviewerName: "Jane S.", date: today }),
      ];

      const duplicates = findDuplicateReviews(reviews);
      expect(duplicates.size).toBe(0);
    });
  });

  describe("Review Burst Detection", () => {
    it("should detect review bursts (many reviews in short period)", () => {
      const baseDate = new Date("2026-01-15");
      const reviews = Array.from({ length: 20 }, (_, i) => {
        const date = new Date(baseDate);
        date.setHours(date.getHours() + i * 2);
        return createMockReview({
          date: date.toISOString(),
          reviewerName: `Reviewer${i}`,
        });
      });

      const result = detectReviewBurst(reviews, 7, 15);
      expect(result.detected).toBe(true);
    });

    it("should not flag naturally distributed reviews", () => {
      const reviews = Array.from({ length: 20 }, (_, i) => {
        const date = new Date("2026-01-15");
        date.setDate(date.getDate() + i * 4);
        return createMockReview({
          date: date.toISOString(),
          reviewerName: `Reviewer${i}`,
        });
      });

      const result = detectReviewBurst(reviews, 7, 15);
      expect(result.detected).toBe(false);
    });
  });
});

describe("Suspicion Score Calculation", () => {
  it("should assign higher suspicion score to reviews with more red flags", () => {
    const cleanReview = createMockReview({
      text: "Room was clean and staff were helpful. The location near the train station was convenient.",
    });

    const suspiciousReview = createMockReview({
      text: "AMAZING!!!! BEST EVER!!!! HIGHLY RECOMMEND!!!!",
    });

    const cleanScore = calculateSuspicionScore(cleanReview);
    const suspiciousScore = calculateSuspicionScore(suspiciousReview);

    expect(suspiciousScore).toBeGreaterThan(cleanScore);
  });

  it("should return suspicion score between 0 and 100", () => {
    const review = createMockReview();
    const score = calculateSuspicionScore(review);

    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("should penalize short reviews", () => {
    const shortReview = createMockReview({ text: "Nice!" });
    const score = calculateSuspicionScore(shortReview);
    expect(score).toBeGreaterThanOrEqual(30);
  });

  it("should penalize extreme ratings without detail", () => {
    const extremeReview = createMockReview({
      text: "Perfect!",
      rating: 10,
      normalizedRating: 10,
    });
    const score = calculateSuspicionScore(extremeReview);
    expect(score).toBeGreaterThan(30);
  });
});

describe("Pre-Filter Reviews", () => {
  it("should flag suspicious reviews", () => {
    const reviews = [
      createMockReview({ text: "AMAZING!!!! BEST EVER!!!!" }),
      createMockReview({
        text: "Good hotel with clean rooms. Staff were friendly and helpful with directions.",
      }),
    ];

    const results = preFilterReviews(reviews);

    expect(results[0].flagged).toBe(true);
    expect(results[1].flagged).toBe(false);
  });

  it("should include reasons for flagging", () => {
    const review = createMockReview({ text: "GREAT!!!!" });
    const results = preFilterReviews([review]);

    expect(results[0].reasons.length).toBeGreaterThan(0);
  });
});

describe("Filter Suspicious Reviews", () => {
  it("should separate verified and filtered reviews", () => {
    const reviews = [
      createMockReview({ text: "Nice!" }),
      createMockReview({
        text: "The hotel was excellent. Clean rooms, friendly staff, great breakfast buffet with lots of options.",
      }),
      createMockReview({
        text: "Perfect location near the train station. Room was modern and comfortable. Would stay again.",
      }),
    ];

    const { verified, stats } = filterSuspiciousReviews(reviews);

    expect(verified.length).toBeGreaterThanOrEqual(2);
    expect(stats.total).toBe(3);
    expect(stats.filtered).toBeGreaterThanOrEqual(0);
    expect(stats.filterPercentage).toBeDefined();
  });

  it("should use custom threshold", () => {
    const reviews = [
      createMockReview({
        text: "Good hotel. Clean and comfortable.",
      }),
    ];

    const { verified: lowThreshold } = filterSuspiciousReviews(reviews, 10);
    const { verified: highThreshold } = filterSuspiciousReviews(reviews, 90);

    expect(highThreshold.length).toBeGreaterThanOrEqual(lowThreshold.length);
  });
});
