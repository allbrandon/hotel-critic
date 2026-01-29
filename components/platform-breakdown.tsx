"use client";

import type { PlatformBreakdown as PlatformBreakdownData } from "@/types/api";
import type { BookingLinks } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PlatformBreakdownProps {
  platforms: Record<string, PlatformBreakdownData>;
  bookingLinks?: BookingLinks;
}

const PLATFORM_DISPLAY_NAMES: Record<string, string> = {
  google: "Google",
  tripadvisor: "TripAdvisor",
  booking: "Booking.com",
  expedia: "Expedia",
  hotelscom: "Hotels.com",
  yelp: "Yelp",
  airbnb: "Airbnb",
};

const PLATFORM_COLORS: Record<string, string> = {
  google: "bg-red-100 text-red-700",
  tripadvisor: "bg-green-100 text-green-700",
  booking: "bg-blue-100 text-blue-700",
  expedia: "bg-yellow-100 text-yellow-700",
  hotelscom: "bg-purple-100 text-purple-700",
  yelp: "bg-red-100 text-red-700",
  airbnb: "bg-pink-100 text-pink-700",
};

function getScoreColor(score: number): string {
  if (score >= 8.0) return "text-green-600";
  if (score >= 6.0) return "text-blue-600";
  if (score >= 4.0) return "text-yellow-600";
  return "text-red-600";
}

export function PlatformBreakdown({
  platforms,
  bookingLinks,
}: PlatformBreakdownProps) {
  const platformEntries = Object.entries(platforms).sort(
    (a, b) => b[1].reviews - a[1].reviews
  );

  if (platformEntries.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No platform data available
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Platform Breakdown</h3>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[140px]">Platform</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead className="text-center">Reviews</TableHead>
              <TableHead className="text-center">Verified</TableHead>
              <TableHead className="text-right">Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {platformEntries.map(([platform, data]) => {
              const displayName = PLATFORM_DISPLAY_NAMES[platform] || platform;
              const colorClass =
                PLATFORM_COLORS[platform] || "bg-gray-100 text-gray-700";
              const link = bookingLinks?.[platform as keyof BookingLinks];

              return (
                <TableRow key={platform}>
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium ${colorClass}`}
                    >
                      {displayName}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`font-semibold ${getScoreColor(data.score)}`}
                    >
                      {data.score.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-gray-600">
                    {data.reviews}
                  </TableCell>
                  <TableCell className="text-center text-gray-600">
                    {data.verified}
                  </TableCell>
                  <TableCell className="text-right">
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-gray-400">
        Scores are normalized to a 0-10 scale. Reviews are weighted by recency
        and platform credibility.
      </p>
    </div>
  );
}
