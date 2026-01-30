"use client";

import { useState } from "react";
import { HotelInputForm } from "@/components/hotel-input-form";
import { LoadingProgress } from "@/components/loading-progress";
import { TrueScoreDisplay } from "@/components/true-score-display";
import { PlatformBreakdown } from "@/components/platform-breakdown";
import { AISummary } from "@/components/ai-summary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AnalyzeHotelResponse, AnalysisStep } from "@/types/api";

export default function Home() {
  const [step, setStep] = useState<AnalysisStep>("idle");
  const [result, setResult] = useState<AnalyzeHotelResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (url: string) => {
    setError(null);
    setResult(null);
    setStep("validating");

    try {
      // Simulate step progression for better UX
      setStep("fetching_reviews");

      const response = await fetch("/api/analyze-hotel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelUrl: url }),
      });

      setStep("analyzing_reviews");

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Analysis failed");
        setStep("error");
        return;
      }

      setStep("calculating_score");

      // Brief delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 500));

      setResult(data);
      setStep("complete");
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
      setStep("error");
    }
  };

  const handleReset = () => {
    setStep("idle");
    setResult(null);
    setError(null);
  };

  const isLoading = !["idle", "complete", "error"].includes(step);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              hotelcritic
            </h1>
            <p className="text-gray-500 mt-1">
              AI-Verified Hotel Reviews You Can Trust
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Form - always visible unless showing results */}
        {!result && (
          <div className="mb-8">
            <HotelInputForm onSubmit={handleAnalyze} isLoading={isLoading} />
          </div>
        )}

        {/* Loading Progress */}
        {isLoading && <LoadingProgress step={step} />}

        {/* Error Display */}
        {error && step === "error" && (
          <div className="max-w-xl mx-auto space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="text-center">
              <Button onClick={handleReset} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && step === "complete" && (
          <div className="space-y-8">
            {/* New Search Button */}
            <div className="text-center">
              <Button onClick={handleReset} variant="outline" size="sm">
                Analyze Another Hotel
              </Button>
            </div>

            {/* True Score Card */}
            <Card>
              <CardContent className="pt-6">
                <TrueScoreDisplay
                  score={result.trueScore}
                  confidence={result.confidence}
                  totalReviews={result.totalReviews}
                  filteredReviews={result.filteredReviews}
                  warnings={result.warnings}
                  dataFreshness={result.dataFreshness}
                />
              </CardContent>
            </Card>

            {/* AI Insights */}
            <AISummary
              highlights={result.highlights}
              lowlights={result.lowlights}
            />

            {/* Platform Breakdown */}
            <Card>
              <CardContent className="pt-6">
                <PlatformBreakdown
                  platforms={result.platforms}
                  bookingLinks={result.bookingLinks}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Idle State - How it works */}
        {step === "idle" && !result && (
          <div className="mt-12 max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-medium text-gray-900">Paste URL</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Enter any Google Maps hotel link
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-medium text-gray-900">AI Analysis</h3>
                <p className="text-sm text-gray-500 mt-1">
                  We aggregate and filter reviews
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-medium text-gray-900">True Score</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Get a reliable, verified rating
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-400">
            Aggregating reviews from Google, TripAdvisor, Booking.com, Expedia,
            and more
          </p>
        </div>
      </footer>
    </main>
  );
}
