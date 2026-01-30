import { describe, it, expect } from "vitest";
import {
  isValidHotelUrl,
  isGoogleMapsUrl,
  extractPlaceId,
  normalizeGoogleMapsUrl,
  generateCacheKey,
} from "../url-validator";

/**
 * Test suite for URL Validation
 * Only Google Maps URLs are supported as input
 * The Apify API uses Google Maps as the source of truth
 */

describe("Google Maps URL Validation", () => {
  describe("Valid Google Maps URLs", () => {
    const validUrls = [
      "https://www.google.com/maps/place/The+Plaza+Hotel/@40.7644,-73.9743,17z",
      "https://google.com/maps/place/Park+Hyatt+Tokyo/data=!4m2!3m1!1s0x0:0x123",
      "https://www.google.com/maps/place/Marina+Bay+Sands/@1.2838,103.8591,17z",
      "https://www.google.com/maps?q=Ritz+Carlton+Hong+Kong",
      "https://www.google.co.uk/maps/place/The+Savoy/@51.5105,-0.1205,17z",
      "https://www.google.co.jp/maps/place/Park+Hyatt+Tokyo",
    ];

    validUrls.forEach((url) => {
      it(`should accept valid Google Maps URL: ${url.substring(0, 50)}...`, () => {
        const result = isValidHotelUrl(url);
        expect(result.valid).toBe(true);
        expect(result.normalizedUrl).toBeDefined();
      });
    });
  });

  describe("Invalid Google URLs (not Maps)", () => {
    const invalidGoogleUrls = [
      "https://www.google.com/travel/hotels/s/abc123",
      "https://www.google.com/search?q=hotels",
      "https://www.google.com/",
      "https://www.google.com/flights",
    ];

    invalidGoogleUrls.forEach((url) => {
      it(`should reject non-Maps Google URL: ${url}`, () => {
        const result = isValidHotelUrl(url);
        expect(result.valid).toBe(false);
        expect(result.error).toBe("UNSUPPORTED_PLATFORM");
      });
    });
  });

  describe("Unsupported Platforms (should suggest Google Maps)", () => {
    const unsupportedUrls = [
      "https://www.booking.com/hotel/us/the-plaza.html",
      "https://www.tripadvisor.com/Hotel_Review-g60763-d93450.html",
      "https://www.expedia.com/hotel/123456",
      "https://www.agoda.com/the-plaza-hotel/hotel/new-york.html",
      "https://www.airbnb.com/rooms/12345",
    ];

    unsupportedUrls.forEach((url) => {
      it(`should reject ${new URL(url).hostname} and suggest Google Maps`, () => {
        const result = isValidHotelUrl(url);
        expect(result.valid).toBe(false);
        expect(result.error).toBe("UNSUPPORTED_PLATFORM");
        expect(result.message).toContain("Google Maps");
      });
    });
  });

  describe("Invalid URL Formats", () => {
    it("should reject empty URL", () => {
      const result = isValidHotelUrl("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("INVALID_URL");
    });

    it("should reject non-URL string", () => {
      const result = isValidHotelUrl("not a url");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("INVALID_URL");
    });

    it("should reject URL without protocol", () => {
      const result = isValidHotelUrl("google.com/maps/place/Hotel");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("INVALID_URL");
    });

    it("should reject ftp protocol", () => {
      const result = isValidHotelUrl("ftp://google.com/maps/place/Hotel");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("INVALID_URL");
    });

    it("should reject localhost URLs", () => {
      const result = isValidHotelUrl("http://localhost/maps/place/Hotel");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("INVALID_URL");
    });

    it("should reject 127.0.0.1 URLs", () => {
      const result = isValidHotelUrl("http://127.0.0.1/maps/place/Hotel");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("INVALID_URL");
    });
  });

  describe("Security", () => {
    it("should reject URLs with script tags", () => {
      const result = isValidHotelUrl(
        "https://google.com/maps/place/<script>alert('xss')</script>"
      );
      expect(result.valid).toBe(false);
      expect(result.error).toBe("SECURITY_VIOLATION");
    });

    it("should reject URLs with event handlers", () => {
      const result = isValidHotelUrl(
        "https://google.com/maps/place/Hotel?name=<img onerror='alert(1)'>"
      );
      expect(result.valid).toBe(false);
      expect(result.error).toBe("SECURITY_VIOLATION");
    });

    it("should reject URLs with path traversal", () => {
      const result = isValidHotelUrl(
        "https://google.com/maps/../../../etc/passwd"
      );
      expect(result.valid).toBe(false);
      expect(result.error).toBe("SECURITY_VIOLATION");
    });
  });
});

describe("isGoogleMapsUrl", () => {
  it("should return true for maps/place URLs", () => {
    expect(isGoogleMapsUrl("https://www.google.com/maps/place/Hotel")).toBe(true);
  });

  it("should return true for maps? query URLs", () => {
    expect(isGoogleMapsUrl("https://www.google.com/maps?q=Hotel")).toBe(true);
  });

  it("should return true for regional Google domains", () => {
    expect(isGoogleMapsUrl("https://www.google.co.uk/maps/place/Hotel")).toBe(true);
    expect(isGoogleMapsUrl("https://www.google.co.jp/maps/place/Hotel")).toBe(true);
  });

  it("should return false for non-maps Google URLs", () => {
    expect(isGoogleMapsUrl("https://www.google.com/search?q=hotel")).toBe(false);
    expect(isGoogleMapsUrl("https://www.google.com/travel/hotels")).toBe(false);
  });

  it("should return false for non-Google URLs", () => {
    expect(isGoogleMapsUrl("https://www.booking.com/hotel")).toBe(false);
  });
});

describe("extractPlaceId", () => {
  it("should extract Place ID from place_id query param", () => {
    const placeId = extractPlaceId(
      "https://www.google.com/maps/place/Hotel?place_id=ChIJN1t_tDeuEmsRUsoyG83frY4"
    );
    expect(placeId).toBe("ChIJN1t_tDeuEmsRUsoyG83frY4");
  });

  it("should extract Place ID from URL path", () => {
    const placeId = extractPlaceId(
      "https://www.google.com/maps/place/The+Plaza/@40.7644,-73.9743/data=!3m1!4b1!4m5!3m4!1s0x0:ChIJabcdef123"
    );
    expect(placeId).toMatch(/^ChIJ/);
  });

  it("should return null if no Place ID found", () => {
    const placeId = extractPlaceId(
      "https://www.google.com/maps/place/The+Plaza+Hotel"
    );
    expect(placeId).toBeNull();
  });
});

describe("normalizeGoogleMapsUrl", () => {
  it("should upgrade to HTTPS", () => {
    const normalized = normalizeGoogleMapsUrl(
      "http://www.google.com/maps/place/Hotel"
    );
    expect(normalized.startsWith("https://")).toBe(true);
  });

  it("should standardize hostname to www.google.com", () => {
    const normalized = normalizeGoogleMapsUrl(
      "https://google.co.uk/maps/place/Hotel"
    );
    expect(normalized).toContain("www.google.com");
  });

  it("should preserve essential parameters", () => {
    const normalized = normalizeGoogleMapsUrl(
      "https://www.google.com/maps/place/Hotel?place_id=ChIJ123&utm_source=test"
    );
    expect(normalized).toContain("place_id=ChIJ123");
    expect(normalized).not.toContain("utm_source");
  });
});

describe("generateCacheKey", () => {
  it("should generate consistent cache key for same hotel", () => {
    const key1 = generateCacheKey(
      "https://www.google.com/maps/place/Hotel?place_id=ChIJ123&utm=test"
    );
    const key2 = generateCacheKey(
      "https://google.com/maps/place/Hotel?place_id=ChIJ123"
    );
    expect(key1).toBe(key2);
  });

  it("should generate different cache keys for different hotels", () => {
    const key1 = generateCacheKey(
      "https://www.google.com/maps/place/Hotel+A?place_id=ChIJ111"
    );
    const key2 = generateCacheKey(
      "https://www.google.com/maps/place/Hotel+B?place_id=ChIJ222"
    );
    expect(key1).not.toBe(key2);
  });

  it("should generate 32-character MD5 hash", () => {
    const key = generateCacheKey(
      "https://www.google.com/maps/place/The+Plaza"
    );
    expect(key).toHaveLength(32);
    expect(key).toMatch(/^[a-f0-9]+$/);
  });
});
