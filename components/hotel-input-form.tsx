"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HotelInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function HotelInputForm({ onSubmit, isLoading }: HotelInputFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Please enter a hotel URL");
      return;
    }

    // Basic URL validation
    try {
      const parsedUrl = new URL(trimmedUrl);
      if (!parsedUrl.hostname.includes("google")) {
        setError("Please enter a Google Maps URL (e.g., google.com/maps/place/...)");
        return;
      }
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    onSubmit(trimmedUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="hotel-url"
            className="block text-sm font-medium text-gray-700"
          >
            Hotel URL
          </label>
          <p className="text-sm text-gray-500">
            Paste a Google Maps URL for any hotel to get its True Score
          </p>
        </div>

        <div className="flex gap-3">
          <Input
            id="hotel-url"
            type="url"
            placeholder="https://www.google.com/maps/place/Hotel+Name..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            disabled={isLoading}
            className="flex-1 h-12 text-base"
          />
          <Button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Analyzing...
              </span>
            ) : (
              "Analyze"
            )}
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </p>
        )}

        <p className="text-xs text-gray-400 text-center">
          We aggregate reviews from Google, TripAdvisor, Booking.com, Expedia, and more
        </p>
      </div>
    </form>
  );
}
