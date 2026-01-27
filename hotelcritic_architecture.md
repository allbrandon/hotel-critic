## Architecture Overview

Single-page Next.js app with one API endpoint. No database for MVP. 24-hour Redis cache.

```
hotelcritic/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Main page (single-page app)
│   └── api/analyze-hotel/route.ts    # Hotel analysis endpoint
├── components/
│   ├── ui/                           # Shadcn components
│   ├── hotel-input-form.tsx          # URL input with validation
│   ├── loading-progress.tsx          # Multi-step loading states
│   ├── true-score-display.tsx        # Score + confidence + freshness
│   ├── platform-breakdown.tsx        # Table of platform contributions
│   ├── ai-summary.tsx                # Highlights/lowlights display
│   └── booking-links.tsx             # Affiliate CTAs
├── lib/
│   ├── apify-client.ts               # Apify API integration
│   ├── claude-client.ts              # Claude API integration
│   ├── cache.ts                      # Vercel KV (Redis) cache
│   ├── true-score.ts                 # Scoring algorithm
│   ├── review-filter.ts              # Fake review detection
│   └── utils.ts                      # Shared utilities
├── types/
│   ├── hotel.ts                      # Hotel & review types
│   └── api.ts                        # API request/response types
└── public/                           # Static assets

```

## Data Flow (60-Second Analysis)

```
1. User Input
   └─→ Paste hotel URL (Booking.com, Google Hotels, Agoda)
        │
2. Cache Check (Vercel KV)
   ├─→ HIT → Return cached results (<5 sec) ✓
   └─→ MISS → Continue to API calls
        │
3. Apify API (20-40 sec)
   └─→ Fetch reviews from all platforms
        │
4. Review Pre-Filter (1 sec)
   └─→ Rule-based: Remove <20 char, duplicates, spam
        │
5. Claude API (15-30 sec)
   ├─→ Analyze each review (0-100 suspicion score)
   ├─→ Extract highlights (3-5 specific positives)
   └─→ Extract lowlights (3-5 specific negatives)
        │
6. True Score Calculation (1 sec)
   ├─→ Check: ≥25 total reviews?
   ├─→ Filter: Remove reviews with score >60
   ├─→ Check: ≥15 reviews after filtering?
   ├─→ Weight: Recency × Platform × Specificity
   └─→ Normalize: Convert to 0-10 scale
        │
7. Cache Results (24h TTL)
   └─→ Store in Vercel KV
        │
8. Return to User
   └─→ Display True Score + AI Summary + Booking Links
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14, React, Tailwind CSS | Single-page app |
| Backend | Next.js API Routes | Serverless endpoint |
| Cache | Vercel KV (Redis) | 24-hour result cache |
| Hosting | Vercel (Free tier) | Deploy + CDN |
| Review Aggregation | Apify API | Multi-platform scraping |
| AI Analysis | Claude Sonnet 4 | Review analysis + summary |
| Monitoring | Sentry (Free tier) | Error tracking |
| Analytics | Vercel Analytics | Usage metrics |

## API Endpoint

**POST /api/analyze-hotel**

Request:
```json
{
  "hotelUrl": "https://www.booking.com/hotel/..."
}
```

Response:
```json
{
  "trueScore": 8.3,
  "confidence": "high",
  "dataFreshness": "2026-01-20T10:30:00Z",
  "cached": false,
  "platforms": {
    "booking": { "score": 8.5, "reviews": 510, "verified": 480 },
    "google": { "score": 4.4, "reviews": 420, "verified": 390 },
    "agoda": { "score": 8.2, "reviews": 340, "verified": 310 }
  },
  "filteredReviews": 125,
  "totalReviews": 1270,
  "highlights": [
    "Rooftop pool praised for city views (mentioned by 78% of guests)",
    "Walking distance to Shinjuku Station (5 minutes)",
    "Breakfast buffet variety excellent (Japanese & Western options)"
  ],
  "lowlights": [
    "Street-facing rooms experience traffic noise until midnight",
    "Check-in lines average 20 minutes during peak hours",
    "Premium Wi-Fi required for high speeds (free tier is slow)"
  ],
  "bookingLinks": {
    "booking": "https://booking.com/...",
    "google": "https://google.com/travel/...",
    "agoda": "https://agoda.com/..."
  }
}
```

## Environment Variables

```bash
# API Keys
APIFY_API_TOKEN=your_apify_token
ANTHROPIC_API_KEY=your_claude_key

# Cache
KV_URL=your_vercel_kv_url
KV_REST_API_TOKEN=your_kv_token

# Security
DAILY_BUDGET_CAP=100  # USD
MAX_REQUESTS_PER_IP_HOUR=10

# Monitoring
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=auto
```

## Cost Protection

```typescript
// lib/budget-cap.ts
export async function checkBudgetCap(): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];
  const key = `budget:${today}`;
  
  const spent = await kv.get<number>(key) || 0;
  const cap = Number(process.env.DAILY_BUDGET_CAP) || 100;
  
  if (spent >= cap) {
    throw new Error('BUDGET_CAP_REACHED');
  }
  
  return true;
}

export async function trackCost(cost: number): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const key = `budget:${today}`;
  
  await kv.incrby(key, Math.round(cost * 100)); // Store cents
  await kv.expire(key, 86400); // 24h expiry
}
```

## Edge Cases Handled

1. **New Hotel (<25 reviews)** → "Insufficient Data" state
2. **High Fake Rate (>70% filtered)** → Warning message
3. **Insufficient Verified (<15 after filter)** → Cannot generate score
4. **Single Platform Only** → Reduced confidence indicator
5. **All Reviews >1 Year Old** → "May be outdated" warning
6. **Budget Cap Reached** → "At capacity for today" message
7. **Invalid URL** → Validation error with supported platforms
8. **Apify/Claude API Failure** → Graceful error + retry logic
