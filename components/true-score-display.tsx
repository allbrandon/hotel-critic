"use client";

import type { ConfidenceLevel, EdgeCaseWarning } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TrueScoreDisplayProps {
  score: number;
  confidence: ConfidenceLevel;
  totalReviews: number;
  filteredReviews: number;
  warnings?: EdgeCaseWarning[];
  dataFreshness: string;
}

function getScoreColor(score: number): {
  bg: string;
  text: string;
  ring: string;
  label: string;
} {
  if (score >= 8.0) {
    return {
      bg: "bg-green-50",
      text: "text-green-700",
      ring: "ring-green-500",
      label: "Excellent",
    };
  }
  if (score >= 6.0) {
    return {
      bg: "bg-blue-50",
      text: "text-blue-700",
      ring: "ring-blue-500",
      label: "Good",
    };
  }
  if (score >= 4.0) {
    return {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      ring: "ring-yellow-500",
      label: "Average",
    };
  }
  return {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-500",
    label: "Below Average",
  };
}

function getConfidenceDisplay(confidence: ConfidenceLevel): {
  label: string;
  color: string;
  description: string;
} {
  switch (confidence) {
    case "high":
      return {
        label: "High Confidence",
        color: "text-green-600",
        description: "Based on 100+ verified reviews",
      };
    case "medium":
      return {
        label: "Medium Confidence",
        color: "text-yellow-600",
        description: "Based on 50-100 verified reviews",
      };
    case "low":
      return {
        label: "Low Confidence",
        color: "text-orange-600",
        description: "Based on fewer than 50 verified reviews",
      };
  }
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TrueScoreDisplay({
  score,
  confidence,
  totalReviews,
  filteredReviews,
  warnings,
  dataFreshness,
}: TrueScoreDisplayProps) {
  const scoreStyle = getScoreColor(score);
  const confidenceDisplay = getConfidenceDisplay(confidence);
  const verifiedReviews = totalReviews - filteredReviews;
  const filterPercentage =
    totalReviews > 0 ? Math.round((filteredReviews / totalReviews) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Main score display */}
      <div className="flex flex-col items-center">
        <div
          className={`
            relative w-36 h-36 rounded-full flex items-center justify-center
            ${scoreStyle.bg} ring-4 ${scoreStyle.ring}
          `}
        >
          <div className="text-center">
            <span className={`text-5xl font-bold ${scoreStyle.text}`}>
              {score.toFixed(1)}
            </span>
            <span className={`text-lg ${scoreStyle.text}`}>/10</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className={`text-lg font-semibold ${scoreStyle.text}`}>
            {scoreStyle.label}
          </p>
          <p className={`text-sm ${confidenceDisplay.color}`}>
            {confidenceDisplay.label}
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
          <p className="text-xs text-gray-500">Total Reviews</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{verifiedReviews}</p>
          <p className="text-xs text-gray-500">Verified</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">{filteredReviews}</p>
          <p className="text-xs text-gray-500">Filtered ({filterPercentage}%)</p>
        </div>
      </div>

      {/* Confidence explanation */}
      <p className="text-xs text-gray-400 text-center">
        {confidenceDisplay.description} • Updated {formatDate(dataFreshness)}
      </p>

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((warning, index) => (
            <Alert key={index} variant="default" className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-800 text-sm">
                {warning.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
}
