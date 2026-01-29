"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AISummaryProps {
  highlights: string[];
  lowlights: string[];
}

export function AISummary({ highlights, lowlights }: AISummaryProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Highlights */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-green-800 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            What Guests Love
          </CardTitle>
        </CardHeader>
        <CardContent>
          {highlights.length > 0 ? (
            <ul className="space-y-2">
              {highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-green-900"
                >
                  <svg
                    className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-green-700 opacity-60">
              No specific highlights identified
            </p>
          )}
        </CardContent>
      </Card>

      {/* Lowlights */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-red-800 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowlights.length > 0 ? (
            <ul className="space-y-2">
              {lowlights.map((lowlight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-red-900"
                >
                  <svg
                    className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{lowlight}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-red-700 opacity-60">
              No significant concerns found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
