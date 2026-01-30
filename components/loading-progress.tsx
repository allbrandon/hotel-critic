"use client";

import { Progress } from "@/components/ui/progress";
import type { AnalysisStep } from "@/types/api";

interface LoadingProgressProps {
  step: AnalysisStep;
}

const STEPS: Array<{
  key: AnalysisStep;
  label: string;
  description: string;
}> = [
  {
    key: "validating",
    label: "Validating",
    description: "Checking URL format",
  },
  {
    key: "fetching_reviews",
    label: "Fetching",
    description: "Gathering reviews from platforms",
  },
  {
    key: "analyzing_reviews",
    label: "Analyzing",
    description: "Detecting suspicious reviews",
  },
  {
    key: "calculating_score",
    label: "Scoring",
    description: "Calculating True Score",
  },
];

function getStepIndex(step: AnalysisStep): number {
  const index = STEPS.findIndex((s) => s.key === step);
  if (step === "complete") return STEPS.length;
  return index >= 0 ? index : 0;
}

function getProgressPercentage(step: AnalysisStep): number {
  if (step === "idle") return 0;
  if (step === "complete") return 100;
  if (step === "error") return 0;

  const index = getStepIndex(step);
  const stepProgress = ((index + 0.5) / STEPS.length) * 100;
  return Math.round(stepProgress);
}

export function LoadingProgress({ step }: LoadingProgressProps) {
  const currentIndex = getStepIndex(step);
  const progress = getProgressPercentage(step);

  return (
    <div className="w-full max-w-xl mx-auto py-8">
      <div className="space-y-6">
        {/* Progress bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500 text-center">
            {step === "complete"
              ? "Analysis complete!"
              : `${progress}% complete`}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-between">
          {STEPS.map((s, index) => {
            const isActive = index === currentIndex;
            const isComplete = index < currentIndex || step === "complete";
            const isPending = index > currentIndex;

            return (
              <div key={s.key} className="flex flex-col items-center flex-1">
                {/* Step circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${
                      isComplete
                        ? "bg-green-500 text-white"
                        : isActive
                          ? "bg-blue-600 text-white animate-pulse"
                          : "bg-gray-200 text-gray-400"
                    }
                  `}
                >
                  {isComplete ? (
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Step label */}
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-blue-600"
                        : isComplete
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${
                      isActive || isComplete ? "text-gray-500" : "text-gray-300"
                    }`}
                  >
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
