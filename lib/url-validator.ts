import crypto from "crypto";

/**
 * Google Maps URL validation result
 */
export interface UrlValidationResult {
  valid: boolean;
  normalizedUrl?: string;
  placeId?: string;
  error?: "INVALID_URL" | "UNSUPPORTED_PLATFORM" | "SECURITY_VIOLATION";
  message?: string;
}

/**
 * Check if URL has potential security issues
 */
function hasSecurityIssues(url: string): boolean {
  const lowerUrl = url.toLowerCase();

  // Check for XSS patterns
  if (
    lowerUrl.includes("<script") ||
    lowerUrl.includes("onerror=") ||
    lowerUrl.includes("onclick=") ||
    lowerUrl.includes("onload=") ||
    lowerUrl.includes("javascript:")
  ) {
    return true;
  }

  // Check for path traversal
  if (url.includes("..") || url.includes("%2F") || url.includes("%2f")) {
    return true;
  }

  return false;
}

/**
 * Check if URL is a valid Google Maps URL
 */
export function isGoogleMapsUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase().replace("www.", "");

    // Must be google.com or google.XX domain
    if (!hostname.startsWith("google.")) {
      return false;
    }

    // Must be a maps/place path or maps with query
    const pathname = parsedUrl.pathname.toLowerCase();

    // Check for /maps/place/... format
    if (pathname.includes("/maps/place/")) {
      return true;
    }

    // Check for /maps with query parameters (e.g., /maps?q=Hotel)
    if (pathname === "/maps" && parsedUrl.search) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Extract Place ID from Google Maps URL if present
 * Place IDs are in the format: ChIJ... (starts with ChIJ or other prefixes)
 */
export function extractPlaceId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    // Check for place_id in query params
    const placeIdParam = parsedUrl.searchParams.get("place_id");
    if (placeIdParam) {
      return placeIdParam;
    }

    // Check for ChIJ pattern in the URL path (common Place ID format)
    const chijMatch = url.match(/ChIJ[\w-]+/);
    if (chijMatch) {
      return chijMatch[0];
    }

    // Check for data parameter that might contain place ID
    const dataParam = parsedUrl.searchParams.get("data");
    if (dataParam) {
      const placeMatch = dataParam.match(/!1s(ChIJ[\w-]+)/);
      if (placeMatch) {
        return placeMatch[1];
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Normalize Google Maps URL by removing unnecessary parameters
 */
export function normalizeGoogleMapsUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);

    // Upgrade to HTTPS
    parsedUrl.protocol = "https:";

    // Standardize hostname
    parsedUrl.hostname = "www.google.com";

    // Keep only essential parameters
    const essentialParams = ["place_id", "q", "query"];
    const newSearchParams = new URLSearchParams();

    essentialParams.forEach((param) => {
      const value = parsedUrl.searchParams.get(param);
      if (value) {
        newSearchParams.set(param, value);
      }
    });

    parsedUrl.search = newSearchParams.toString();

    return parsedUrl.toString();
  } catch {
    return url;
  }
}

/**
 * Validate a Google Maps hotel URL
 * @param url - The URL to validate
 * @returns Validation result with normalized URL or error
 */
export function isValidHotelUrl(url: string): UrlValidationResult {
  // Check for empty or non-string input
  if (!url || typeof url !== "string" || url.trim() === "") {
    return {
      valid: false,
      error: "INVALID_URL",
      message: "URL is required",
    };
  }

  // Check for security issues first
  if (hasSecurityIssues(url)) {
    return {
      valid: false,
      error: "SECURITY_VIOLATION",
      message: "URL contains potentially malicious content",
    };
  }

  // Try to parse the URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return {
      valid: false,
      error: "INVALID_URL",
      message: "Invalid URL format",
    };
  }

  // Check protocol
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return {
      valid: false,
      error: "INVALID_URL",
      message: "URL must use http or https protocol",
    };
  }

  // Check for localhost/internal addresses
  const hostname = parsedUrl.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname.startsWith("127.") ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname === "0.0.0.0"
  ) {
    return {
      valid: false,
      error: "INVALID_URL",
      message: "Local addresses are not allowed",
    };
  }

  // Check if it's a Google Maps URL
  if (!isGoogleMapsUrl(url)) {
    return {
      valid: false,
      error: "UNSUPPORTED_PLATFORM",
      message:
        "Please provide a Google Maps URL (e.g., google.com/maps/place/...)",
    };
  }

  // Extract place ID if available
  const placeId = extractPlaceId(url);

  // All checks passed
  return {
    valid: true,
    normalizedUrl: normalizeGoogleMapsUrl(url),
    placeId: placeId || undefined,
  };
}

/**
 * Generate a cache key for a hotel URL
 * Uses MD5 hash of normalized URL or place ID
 */
export function generateCacheKey(url: string): string {
  const placeId = extractPlaceId(url);

  if (placeId) {
    // Use place ID for consistent cache keys
    return crypto.createHash("md5").update(placeId).digest("hex");
  }

  // Fallback to normalized URL
  const normalized = normalizeGoogleMapsUrl(url);
  try {
    const parsedUrl = new URL(normalized);
    const keyBase = `${parsedUrl.hostname}${parsedUrl.pathname}`;
    return crypto.createHash("md5").update(keyBase).digest("hex");
  } catch {
    return crypto.createHash("md5").update(url).digest("hex");
  }
}

// Legacy exports for backwards compatibility during transition
export function extractPlatform(url: string): "google" | null {
  return isGoogleMapsUrl(url) ? "google" : null;
}

export function normalizeHotelUrl(url: string): string {
  return normalizeGoogleMapsUrl(url);
}
