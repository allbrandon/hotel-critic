# PRODUCT REQUIREMENTS DOCUMENT
# hotelcritic
## AI-Verified Hotel Review Aggregation Platform

**Version:** 1.0  
**Date:** January 19, 2026  
**Status:** Draft - Ready for Development  
**Owner:** Product Management Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [User Personas](#4-user-personas)
5. [Technical Architecture](#5-technical-architecture)
6. [Functional Requirements](#6-functional-requirements)
7. [API Specifications](#7-api-specifications)
8. [Data Models](#8-data-models)
9. [Implementation Plan](#9-implementation-plan)
10. [Success Metrics](#10-success-metrics)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Vision and Value Proposition

hotelcritic is revolutionizing the hotel booking experience by solving the fundamental trust problem that plagues modern travelers. Every year, millions of travelers waste time cross-referencing reviews across multiple platforms, only to arrive at hotels that fail to meet expectations due to fake reviews, outdated information, and misleading marketing materials. Our platform uses advanced AI to aggregate, verify, and synthesize hotel reviews from the world's leading travel platforms—TripAdvisor, Google Reviews, Booking.com, and others—into a single, trustworthy 'True Score' that travelers can rely on.

Unlike traditional review aggregators that simply collect ratings, hotelcritic applies sophisticated AI analysis to identify and filter suspicious reviews, detect patterns of manipulation, and surface authentic user-generated content. We cut through the noise by presenting travelers with AI-generated summaries that highlight genuine strengths and weaknesses in natural language. This streamlined approach enables travelers to make informed decisions in minutes rather than hours.

**MVP Philosophy:** We're starting lean with a simple, powerful core: users provide a hotel name or link, and within 60 seconds receive a verified True Score with AI-generated highlights and lowlights. No accounts, no complex features—just immediate, trustworthy hotel insights. This validates our core value proposition before building extensive infrastructure.

### 1.2 Key Objectives (MVP - Month 1-3)

| Objective | Metric | Target |
|-----------|--------|--------|
| Product Validation | Successful hotel analyses delivered | 1,000+ requests processed |
| User Trust | Net Promoter Score (NPS) for True Score accuracy | 40+ (realistic for V1) |
| AI Quality | User satisfaction with highlights/lowlights | 80%+ report summaries as "helpful" |
| Performance | Average analysis completion time | <60 seconds |
| Cost Efficiency | Cost per hotel analysis | <$0.35 |

### 1.3 MVP Success Criteria

**Primary Success Criteria:**

- **Product Validation:** Successfully process 1,000+ hotel analysis requests within first 3 months
- **User Trust:** Achieve NPS of 40+ for True Score accuracy (realistic V1 target - Apple/Tesla are 60+)
- **North Star Metric:** 80%+ users find AI summaries "helpful" - this is more important than NPS for MVP
- **Technical Performance:** Deliver complete analysis (True Score + AI summary) in under 60 seconds for 95% of requests (cache hits <5 seconds)
- **Cost Viability:** Maintain operational cost under $0.35 per analysis to validate sustainable economics

**MVP Scope - What We're Building:**
- Simple web interface: user enters hotel name or booking platform URL
- Real-time data aggregation via Apify API (hotel-review-aggregator)
- AI-powered fake review detection and filtering
- Claude API-generated highlights and lowlights
- True Score calculation and transparent breakdown
- Mobile-responsive single-page design

**MVP Scope - What We're NOT Building:**
- User accounts or authentication
- Database or data persistence
- Automated scraping or scheduled updates
- Price comparison or affiliate links
- Photo galleries or video integration
- Search functionality or hotel browsing
- Notifications or alerts

---

## 2. PROBLEM STATEMENT

### 2.1 Current Market Situation

The online hotel booking market is experiencing a crisis of trust. With global online travel bookings reaching $833 billion in 2024 and projected to exceed $1.1 trillion by 2028, travelers are making high-stakes decisions based on information they increasingly cannot trust. Recent industry studies reveal the magnitude of the problem: 67% of travelers report being misled by professional hotel photos, 43% have encountered fake reviews, and consumers spend an average of 3.5 hours researching a single hotel booking across multiple platforms.

The review ecosystem has become fragmented and unreliable. A typical mid-range hotel might have 500 reviews on TripAdvisor, 300 on Google, 250 on Booking.com, 180 on Agoda, and 120 on Klook—each platform with different rating scales, verification methods, and susceptibility to manipulation. Hotels receive vastly different scores across platforms: a hotel rated 8.5 on Booking.com might be rated 4.0 out of 5 on TripAdvisor and 4.2 on Google, leaving travelers confused about which rating to trust. This inconsistency isn't random—it reflects differences in review verification, user demographics, and varying levels of review manipulation.

The fake review industry has grown into a multi-billion dollar underground economy. According to research by the World Economic Forum and consumer protection agencies, an estimated 10-20% of online reviews for accommodations are fake or incentivized. Hotels pay between $5-$15 per fake positive review, and some agencies offer packages of 50+ reviews for under $500. Negative review suppression services charge $100-$500 per review removal or burial. This manipulation particularly affects budget and mid-range hotels competing for visibility, creating a marketplace where dishonest operators can outrank genuine quality establishments.

### 2.2 User Pain Points

#### Pain Point 1: Information Overload and Platform Fragmentation

**Scenario:** Sarah, a 32-year-old marketing manager, is planning a family vacation to Bali. She finds a promising beachfront resort that looks perfect in photos. To verify the hotel's quality, she opens tabs for TripAdvisor, Google Reviews, Booking.com, Agoda, and Klook. TripAdvisor shows 4.0/5 stars (732 reviews), Google shows 4.2/5 (487 reviews), Booking.com shows 8.5/10 (623 reviews), Agoda shows 8.2/10 (401 reviews), and Klook shows 4.3/5 (156 reviews). She spends 45 minutes reading reviews across all platforms, trying to identify common themes and red flags. Recent reviews on TripAdvisor mention construction noise, but Booking.com reviews from the same period don't mention it. She's left uncertain whether the construction is ongoing and which platform provides more reliable information.

**Impact:** Users waste 2-4 hours per booking researching across platforms, experience decision fatigue, and often make suboptimal choices due to information overload. The cognitive burden of synthesizing disparate information sources leads to 'paralysis by analysis' where travelers either book impulsively to escape the research burden or abandon bookings entirely.

#### Pain Point 2: Fake and Manipulated Reviews

**Scenario:** Michael, a 45-year-old business traveler, books a highly-rated budget hotel (4.7 stars, 280 reviews) near the airport for a client meeting. Upon arrival, he discovers peeling wallpaper, a non-functional air conditioner, and a bathroom that hasn't been renovated in decades—nothing like the gleaming photos or glowing reviews suggested. Reviewing the hotel's review history more carefully, he notices that 150 of the 280 reviews were posted within a 3-week period six months ago, many using similar language patterns like 'exceeded expectations,' 'highly recommend,' and 'great value for money.' The hotel clearly purchased bulk fake reviews to boost its rating. Michael loses sleep due to heat and noise, arrives exhausted to his client meeting, and vows to be more thorough in his research—but lacks tools to detect such manipulation.

**Impact:** 43% of travelers have booked hotels based on fake reviews, leading to an estimated $152 billion in annual consumer losses through poor hotel experiences, wasted travel time, and emergency rebookings. The emotional toll includes stress, vacation disappointment, and erosion of trust in online reviews generally.

#### Pain Point 3: Misleading Professional Photography

**Scenario:** Jennifer and Tom, a couple celebrating their anniversary, book a 'luxury boutique hotel' based on stunning professional photos showing spacious rooms with ocean views, modern bathrooms with rainfall showers, and elegant dining areas. They pay $350 per night—a splurge for their budget. Upon check-in, they discover their 'ocean view' room has a tiny window overlooking a parking lot, the 'spacious' room is barely 180 square feet, the bathroom is dated with a basic shower, and the 'elegant dining area' is a cramped breakfast nook. The professional photos used wide-angle lenses, strategic lighting, and selective angles to dramatically misrepresent the property. They feel cheated and spend their anniversary weekend upset, having drained their vacation budget on a disappointing experience.

**Impact:** 67% of travelers report being misled by hotel photos. The gap between marketing imagery and reality is the primary driver of negative reviews and post-booking disappointment. This damages trust in the entire booking ecosystem and leads to increased refund requests and chargebacks.

### 2.3 Opportunity Size and Cost of Inaction

**Market Opportunity:**

- **Total Addressable Market (TAM):** $833 billion global online travel booking market, with hotel bookings representing approximately $450 billion
- **Serviceable Addressable Market (SAM):** Targeting independent travelers who actively research hotels online before booking, representing approximately $180 billion in annual bookings
- **Serviceable Obtainable Market (SOM):** Capturing 0.5% of SAM in affiliate revenue (assuming 4% average affiliate commission) represents $36 million in annual revenue potential
- Average affiliate commission rates: 3-6% for hotel bookings, 4-8% for premium properties

**Consumer Cost of Inaction:**

- $152 billion annually in consumer value lost due to poor hotel experiences driven by fake reviews and misleading information
- Average 3.5 hours spent researching each hotel booking, representing billions of collective hours wasted annually
- 27% of travelers report booking anxiety and decision stress related to uncertainty about hotel quality
- Emergency rebooking costs average $185 per incident when travelers arrive at unacceptable hotels

**Industry Cost of Inaction:**

- Trust erosion threatens long-term growth of online travel booking sector
- Honest hotels lose bookings to competitors who manipulate reviews and photos
- Review platforms face increasing regulatory scrutiny over fake content
- Customer acquisition costs rise as trust in traditional review platforms declines

---

## 3. SOLUTION OVERVIEW

### 3.1 How the Solution Works

hotelcritic solves the trust and information overload problems through a simple, on-demand analysis workflow powered by third-party APIs and AI.

#### User Flow (60-Second Analysis)

1. **User Input:** User enters a hotel name or pastes a URL from Booking.com, TripAdvisor, or Google Hotels
2. **Data Aggregation (20-30s):** Apify API fetches reviews from multiple platforms in real-time
3. **AI Processing (20-30s):** Claude analyzes reviews, filters suspicious content, generates insights
4. **Results Display (instant):** User sees True Score with transparent breakdown and AI-generated highlights/lowlights

#### Layer 1: Real-Time Data Aggregation (Apify API)

Instead of building a custom scraping engine for MVP, we leverage Apify's production-ready hotel-review-aggregator API (https://apify.com/tri_angle/hotel-review-aggregator). This API:

- Aggregates reviews from Booking.com, Google Reviews, and other major platforms (NOT TripAdvisor due to litigation risk)
- Handles anti-scraping measures and proxy rotation automatically
- Returns normalized JSON data with reviews, ratings, and metadata
- Processes requests in 20-40 seconds depending on hotel size
- Costs approximately $0.10-0.25 per hotel analysis (based on compute units)

**CRITICAL: 24-Hour Cache Implementation**

To prevent duplicate API costs for viral hotels or page refreshes:
- Implement lightweight cache using Vercel KV (Redis-compatible, free tier)
- Cache key: MD5 hash of hotel URL
- Cache TTL: 24 hours
- Cache hit = instant results + $0 API cost
- Estimated cache hit rate: 30-50% at scale (saves $3,000-$5,000/month)

**API Integration:**
```javascript
// Single API call fetches all review data
const apifyClient = new ApifyClient({ token: process.env.APIFY_TOKEN });
const run = await apifyClient.actor('tri_angle/hotel-review-aggregator').call({
  hotelUrl: userProvidedUrl,
  maxReviews: 500 // Limit to control cost/speed
});
```

#### Layer 2: AI-Powered Review Analysis (Claude API)

**MVP Approach: Simple Heuristics + Claude Pattern Detection**

For MVP, we use a pragmatic, fast-to-implement approach rather than fine-tuned ML models:

**Phase 1: Rule-Based Pre-Filtering (Quick Wins)**
- Reviews with <20 characters of text → Flag as suspicious
- Reviews posted on same day by same reviewer name → Flag as duplicate
- Reviews with ALL CAPS or excessive exclamation marks → Flag as emotional manipulation
- Reviews matching common spam patterns (generic phrases database)

**Phase 2: Claude-Based Pattern Detection**
Each remaining review is analyzed by Claude with a simplified prompt:
```
Rate this review's authenticity (0-100) based on:
- Specificity (mentions concrete details vs. generic praise)
- Balance (acknowledges both positives and negatives vs. extreme one-sided)
- Natural language (sounds like real person vs. promotional copy)

Review: [text]
Output ONLY a number 0-100.
```

**MVP Filtering Threshold:**
- Reviews scoring <40 → Flagged as suspicious
- **Tradeoff:** Some false positives acceptable for MVP
- **Success metric:** User feedback "Does this score feel accurate?" >75%

**V2 Enhancement: Fine-Tuned Classifier**
- Collect 1,000+ labeled examples from MVP user feedback
- Fine-tune lightweight BERT model for <$500
- Achieve 90%+ precision/recall
- Reduce Claude API costs by 60%

#### Layer 3: True Score Calculation

**Minimum Review Threshold (NEW):**
- Requires ≥25 total reviews across all platforms for reliable scoring
- If <25 reviews: Display "Insufficient Data" state instead of True Score
- Rationale: Single fake review has disproportionate impact in small samples
- User message: "This hotel doesn't have enough reviews yet for a reliable True Score. Check back after more guests have stayed!"

The True Score algorithm:
1. **Pre-Flight Check:** Verify ≥25 total reviews available
2. **Filter suspicious reviews:** Remove reviews with suspicion score >60
3. **Post-Filter Check:** Must retain ≥15 reviews after filtering to generate score
4. **Weight remaining reviews by:**
   - Recency (last 3 months = 2x weight, 3-6 months = 1.5x, >6 months = 1x)
   - Platform credibility (Booking.com = 1.2x for verified stays)
   - Review length and specificity (longer, detailed reviews = 1.1x)
5. **Normalize** platform scores to 0-10 scale
6. **Calculate** weighted average

**Edge Case Handling:**
- **<25 total reviews:** Show "Insufficient Data" + link to view on platforms
- **>70% filtered as suspicious:** Show warning "Many suspicious reviews detected - score may be unreliable"
- **<15 reviews after filtering:** Show "Insufficient verified reviews"
- **Single platform only:** Note "Limited to [Platform] reviews - confidence reduced"
- **All reviews >1 year old:** Note "Reviews may be outdated"

**Transparency:** Users see exactly which reviews were filtered and why, building trust in the algorithm.

#### Layer 4: Results Presentation

Simple, clean interface showing:
- **True Score (0-10)** - Large, color-coded display with confidence indicator
- **AI Confidence Score** - "High Confidence" (>100 reviews), "Medium Confidence" (50-100), "Low Confidence" (<50)
- **Data Freshness Timestamp** - "Analysis based on reviews through Jan 19, 2026" + cache age if applicable
- **Platform Breakdown** - Table showing contribution from each platform
- **Filtered Reviews** - Count and percentage of suspicious reviews removed (with reasoning)
- **Highlights (3-5 points)** - Specific positives extracted by AI
- **Lowlights (3-5 points)** - Specific negatives extracted by AI
- **Booking Links** - Simple affiliate links to major platforms (optional for MVP)

**"Show Your Work" Transparency:**
- Clicking True Score reveals calculation methodology
- Hovering over confidence shows: "Based on 147 verified reviews from 3 platforms"
- Data freshness indicates cache age: "Cached 3 hours ago" or "Freshly analyzed"

### 3.2 Technical Approach and Key Decisions

#### Decision 1: Apify API vs. Custom Scraping

**For MVP:**
- ✅ Use Apify's hotel-review-aggregator API
- **Rationale:** Faster time-to-market (days vs. months), no anti-scraping maintenance, proven reliability, predictable costs
- **Cost:** ~$0.15 per analysis (acceptable for MVP validation)
- **Migration Path:** Build custom scraping engine in V2 if cost becomes prohibitive at scale

#### Decision 2: Stateless, On-Demand Processing

**For MVP:**
- ✅ No database, no data persistence
- ✅ Process each request in real-time
- **Rationale:** Simplicity, no infrastructure overhead, always fresh data, minimal legal/privacy concerns
- **Tradeoff:** Slower response time (60s vs. instant), higher per-request cost
- **Migration Path:** Add caching/database in V2 for popular hotels

#### Decision 3: Claude for All AI Processing

**For MVP:**
- ✅ Use Claude Sonnet for both fake review detection AND summarization
- **Rationale:** Single API integration, high quality output, fast iteration on prompts
- **Cost:** ~$0.15-0.25 per analysis (500 reviews × ~300 tokens each × $3/1M tokens)
- **Migration Path:** Fine-tune custom models in V2 if Claude costs too high

#### Decision 4: Simple Frontend, No Accounts

**For MVP:**
- ✅ Single-page React app with one input field
- ✅ No user accounts, no login
- **Rationale:** Eliminate complexity, faster development, easier to test value proposition
- **Tradeoff:** No personalization, no saved searches
- **Migration Path:** Add Auth0 in V2 when adding favorites/alerts

### 3.3 Core Differentiators

**1. True Score with Radical Transparency**

Unlike other review aggregators, we show users:
- Exactly which reviews were filtered as suspicious (with reasons)
- How each platform's score contributed to the final True Score
- The weighting algorithm explained in plain English

**2. AI Summaries with Specific Examples**

Our Claude-powered summaries don't say "great hotel" - they say: "Breakfast buffet praised for variety (mentioned in 73% of reviews), but service can be slow during peak hours (8-9am). Request room above 5th floor to avoid street noise from nearby nightlife district (floors 2-4 frequently mentioned)."

**3. On-Demand, Always Fresh**

Because we don't cache data, every analysis pulls the latest reviews. Users never see outdated information from 6 months ago.

**4. No Account Required**

Zero friction - paste a URL, get insights. No signup walls, no email required, no commitment.

---

## 4. USER PERSONAS

### 4.1 Primary Persona: The Burned Traveler (Trust-Focused)

| Attribute | Details |
|-----------|---------|
| **Name** | Michael Chen |
| **Age / Role** | 42-year-old Senior Accountant |
| **Tech Proficiency** | Intermediate - comfortable with web apps, compares multiple sites |
| **Travel Frequency** | 4-6 trips per year (mix of business and leisure) |
| **Annual Travel Spend** | $8,000 - $12,000 |

#### Background and Goals

Michael travels frequently for work and books 1-2 family vacations annually. After several bad experiences with hotels that didn't match their online reviews and photos—including a 'luxury resort' that turned out to be outdated and under renovation—he has become extremely skeptical of hotel ratings. He now spends significant time cross-referencing reviews across multiple platforms, looking for patterns of fake reviews, and scrutinizing every photo to determine if it's professionally taken or from actual guests. His primary goal is to never be disappointed again—he values reliability over cost savings.

#### Current Workflow

1. Searches Google for hotels in destination city
2. Opens 5-8 promising hotels in separate tabs
3. For each hotel, checks TripAdvisor, Google Reviews, and Booking.com
4. Sorts reviews by 'most recent' and reads the last 20-30 reviews on each platform
5. Looks for red flags: review bursts, generic language, all 5-star reviews with no detail
6. Scrolls through photos, trying to identify user-uploaded vs. professional photos
7. Creates a spreadsheet comparing hotels across dimensions like location, price, and verified quality signals
8. Takes 2-4 hours per booking, often abandons search due to decision fatigue

#### Pain Points

- Wastes hours manually verifying reviews across platforms
- Cannot easily identify which reviews are trustworthy
- Struggles to reconcile conflicting ratings across platforms
- Professional photos consistently mislead him about actual room quality
- Has to read dozens of reviews to extract common themes

#### Quote

> "I've been burned too many times by hotels with great ratings that turned out to be terrible. Now I spend hours reading reviews across multiple sites, trying to figure out which ones are fake. I just want someone to tell me the truth about what a hotel is really like—I don't care if it's not perfect, I just don't want surprises."

#### How hotelcritic Helps

The True Score immediately shows Michael a verified rating that filters out suspicious reviews. AI-generated summaries give him specific information (e.g., 'recent renovation mentioned frequently,' 'breakfast quality praised,' 'Wi-Fi reported as slow') without reading 200 reviews. The platform's transparency—showing exactly which reviews were flagged as suspicious and why—builds the trust Michael needs to book confidently.

### 4.2 Secondary Persona: The Efficiency Seeker (Time-Focused)

| Attribute | Details |
|-----------|---------|
| **Name** | Emma Rodriguez |
| **Age / Role** | 29-year-old Product Manager at a tech startup |
| **Tech Proficiency** | Advanced - power user, expects data-driven tools |
| **Travel Frequency** | 8-12 trips per year (digital nomad lifestyle) |
| **Annual Travel Spend** | $15,000 - $20,000 |

#### Background and Goals

Emma works remotely and travels frequently, often booking hotels on short notice for 1-2 week stays. She values efficiency and data-driven decision making. Her time is valuable—she would rather pay slightly more for a hotel she can book confidently in 10 minutes than save $30 but spend 2 hours researching. She's tech-savvy and frustrated by clunky, outdated hotel booking interfaces. She expects tools to synthesize information intelligently and present actionable insights, not dump raw data on her.

#### Current Workflow

1. Uses Google Flights or Skyscanner for flight research, expects similar efficiency for hotels
2. Opens Booking.com or Agoda, filters by neighborhood and price
3. Clicks top 3-5 results, quickly scans ratings and first page of reviews
4. Gets frustrated when reviews are contradictory or don't address her specific concerns (Wi-Fi quality, desk space for work)
5. Often books impulsively based on star rating alone due to time pressure, leading to occasional disappointment
6. Wishes there was a 'TLDR' summary of what a hotel is actually like

#### Pain Points

- No time to read hundreds of reviews, but star ratings alone are unreliable
- Hard to find information about specific amenities important to remote workers (desk quality, Wi-Fi speed, power outlets)
- Review platforms don't summarize recent changes or trends
- Wants quick comparison across platforms but doesn't want to manually check each one

#### Quote

> "I book hotels monthly and I don't have time to read 500 reviews. I just want a smart summary that tells me: Is this hotel actually as good as its rating suggests? What are the real pros and cons? What's changed recently? Give me the information I need in 2 minutes so I can book and move on with my life."

#### How hotelcritic Helps

The AI-generated highlights and lowlights give Emma exactly what she needs: specific, actionable insights extracted from hundreds of reviews in seconds. She sees immediately that a hotel has 'excellent Wi-Fi speeds (consistently 50+ Mbps)' and 'spacious desks in rooms' or that it has 'limited power outlets' and 'thin walls with noise complaints.' She makes informed decisions in minutes, not hours.

### 4.3 Tertiary Persona: The Value Hunter (Price-Focused)

| Attribute | Details |
|-----------|---------|
| **Name** | David Thompson |
| **Age / Role** | 35-year-old High School Teacher |
| **Tech Proficiency** | Intermediate - comparison shops actively, uses coupon sites |
| **Travel Frequency** | 2-3 family trips per year on limited budget |
| **Annual Travel Spend** | $3,000 - $5,000 |

#### Background and Goals

David travels with his wife and two young children during summer and holiday breaks. With a limited budget, he's highly price-sensitive and always looking for the best value. He's willing to spend time finding deals but also needs to ensure the hotel is safe, clean, and family-friendly—he can't risk booking a terrible hotel that ruins the family vacation. He actively looks for discount codes, compares prices across booking sites, and books through whichever platform offers the best price.

#### Current Workflow

1. Searches for hotels on Booking.com, Agoda, and Hotels.com simultaneously
2. Compares prices across platforms for same hotel
3. Searches Google for '[hotel name] discount code' or '[hotel name] coupon'
4. Checks cashback sites like Rakuten or TopCashback for additional savings
5. Reads reviews to ensure quality meets minimum family-friendly standards
6. Often paralyzed by choice when multiple hotels have similar prices and ratings

#### Pain Points

- Price comparison across platforms is tedious and time-consuming
- Difficult to find discount codes that actually work
- Can't tell if a cheap hotel is a 'good deal' or 'too good to be true'
- Worried about booking through unfamiliar platforms to save $20

#### Quote

> "I'm always looking for the best deal, but I also can't afford to waste money on a hotel that turns out to be terrible—I've got two kids and a limited vacation budget. I wish there was one place that showed me the real rating and all the prices across different sites so I can just book the best value without spending half a day hunting for discount codes."

#### How hotelcritic Helps

The affiliate price comparison feature shows David current prices across Booking.com, Agoda, Klook, and other platforms in one view, saving him from manually checking each site. When we integrate coupon functionality in V2, he'll see applicable discount codes automatically. Most importantly, the True Score ensures that a budget hotel with a suspiciously high rating isn't hiding fake reviews—he can book the cheapest reliable option with confidence.

---

## 5. TECHNICAL ARCHITECTURE

### 5.1 MVP System Components and Technology Stack

#### Frontend Layer

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Web Framework | Next.js 14 (React) | SEO optimization, server-side rendering, fast deployment |
| UI Library | Tailwind CSS + shadcn/ui | Rapid development, clean design, mobile-responsive |
| State Management | React hooks (useState, useEffect) | Simple enough for single-page app, no need for complex state |
| Hosting | Vercel | Free tier for MVP, seamless Next.js deployment, global CDN |

#### Backend Layer

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| API Framework | Next.js API Routes | Integrated with frontend, serverless deployment, simple setup |
| Hosting | Vercel Serverless Functions | Free tier generous enough for MVP traffic, auto-scaling |

#### External APIs

| Service | Purpose | Cost Model |
|---------|---------|-----------|
| Apify (hotel-review-aggregator) | Fetch hotel reviews from multiple platforms | ~$0.15 per analysis (pay-as-you-go) |
| Anthropic Claude API | Fake review detection + AI summarization | ~$0.20 per analysis (500 reviews × 300 tokens avg) |

#### Monitoring (Optional for MVP)

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Error Tracking | Sentry (free tier) | Real-time error reporting for debugging |
| Analytics | Vercel Analytics (included) | Basic usage metrics without complexity |

### 5.2 Data Flow and Integration

#### Request Flow (60-Second Analysis)

```
1. User submits hotel URL/name
   ↓
2. Next.js API route receives request
   ↓
3. Call Apify API (hotel-review-aggregator)
   - Parse hotel URL or search by name
   - Fetch reviews from all platforms
   - Duration: 20-40 seconds
   ↓
4. Process Apify response
   - Extract reviews, ratings, metadata
   - Normalize data structure
   ↓
5. Call Claude API with structured prompt
   - Analyze all reviews for suspicious patterns
   - Extract highlights/lowlights
   - Generate aspect-based insights
   - Duration: 15-30 seconds
   ↓
6. Calculate True Score
   - Filter suspicious reviews
   - Apply recency weighting
   - Normalize platform scores
   - Duration: <1 second
   ↓
7. Return JSON response to frontend
   ↓
8. Display results to user
```

#### Apify API Integration

```javascript
// Backend API route: /api/analyze-hotel

import { ApifyClient } from 'apify-client';

export default async function handler(req, res) {
  const { hotelUrl } = req.body;
  
  // Step 1: Fetch reviews via Apify
  const apifyClient = new ApifyClient({ 
    token: process.env.APIFY_API_TOKEN 
  });
  
  const run = await apifyClient.actor('tri_angle/hotel-review-aggregator').call({
    hotelUrl: hotelUrl,
    maxReviews: 500, // Limit for cost control
    platforms: ['tripadvisor', 'booking', 'google']
  });
  
  const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
  const reviewData = items[0]; // Contains all aggregated reviews
  
  // Step 2: Send to Claude for analysis
  const claudeResponse = await analyzeWithClaude(reviewData);
  
  // Step 3: Calculate True Score
  const trueScore = calculateTrueScore(reviewData, claudeResponse);
  
  // Step 4: Return results
  res.json({
    trueScore,
    highlights: claudeResponse.highlights,
    lowlights: claudeResponse.lowlights,
    platformBreakdown: reviewData.platformScores,
    filteredReviews: claudeResponse.suspiciousCount
  });
}
```

#### Claude API Integration

```javascript
import Anthropic from '@anthropic-ai/sdk';

async function analyzeWithClaude(reviewData) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const prompt = `Analyze these hotel reviews and provide:

1. For each review, assess suspicion level (0-100):
   - Generic language patterns
   - Extreme sentiment without specifics
   - Temporal clustering indicators

2. Extract 3-5 SPECIFIC highlights (positive aspects with examples)
3. Extract 3-5 SPECIFIC lowlights (negative aspects with examples)
4. Note any recent trends or changes

Reviews:
${JSON.stringify(reviewData.reviews, null, 2)}

Respond in JSON format with: highlights[], lowlights[], suspiciousReviews[]`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(message.content[0].text);
}
```

### 5.3 Scalability Considerations for MVP

**Current Approach (MVP):**
- Stateless processing - no database bottlenecks
- Serverless functions auto-scale with traffic
- External APIs (Apify, Claude) handle their own scaling
- **Bottleneck:** Sequential API calls (Apify → Claude) create 60s latency

**Cost Scaling:**
- At 100 requests/day: ~$35/day ($1,050/month)
- At 500 requests/day: ~$175/day ($5,250/month)
- At 1000 requests/day: ~$350/day ($10,500/month)

**Migration Path (V2):**
When request volume reaches 500+/day:
1. Add PostgreSQL database to cache popular hotels (reduce Apify calls)
2. Add Redis for sub-60-second repeat requests
3. Build custom scraping engine to replace Apify (~$0.05 per analysis vs. $0.15)
4. Fine-tune BERT model for fake review detection (~$0.02 vs. $0.15 Claude cost)

### 5.4 Security Considerations

**API Key Management:**
- Store all API keys in Vercel environment variables
- Never expose keys in frontend code
- Rotate keys quarterly

**CRITICAL: Daily Budget Cap (Viral Bill Kill-Switch)**
- Implement hard daily credit limit in backend
- Track cumulative API costs in Redis counter
- Default cap: $100/day (adjustable via env variable)
- When cap reached:
  - Stop processing new requests
  - Show user message: "We're at capacity for today. Bookmark this hotel and check back tomorrow!"
  - Send alert to admin email/Slack
  - Reset counter at midnight UTC
- Prevents $5,000+ surprise bills from Reddit/HackerNews traffic spike

**Rate Limiting:**
- IP-based: Max 10 requests/hour per IP (prevents single-user abuse)
- Global: Max 500 requests/day for MVP (before budget cap triggers)
- Use Vercel Edge Config or Redis for rate limit tracking

**Input Validation:**
- Sanitize user-provided URLs
- Validate URL format before sending to Apify
- Allowlist for supported domains only (booking.com, google.com/travel, agoda.com)
- Prevent injection attacks

**Error Handling:**
- Graceful degradation if APIs fail
- Clear error messages to users
- Log errors to Sentry for debugging
- Retry logic with exponential backoff

---

## 6. FUNCTIONAL REQUIREMENTS

### 6.1 MVP User Stories with Acceptance Criteria

#### Epic 1: Hotel Analysis Request

**US-101: Submit Hotel URL for Analysis (P0)**

**As a** traveler  
**I want to** submit a hotel URL for analysis  
**So that** I can get a verified True Score and AI insights

**Acceptance Criteria:**
- Single prominent input field on homepage accepts ONLY hotel URLs
- Supported URL formats: 
  - Booking.com: `https://www.booking.com/hotel/...`
  - Google Hotels: `https://www.google.com/travel/hotels/...`
  - Agoda: `https://www.agoda.com/...`
- "Analyze Hotel" button clearly visible
- Input validation shows error for non-URL or unsupported platform
- Helper text: "Paste a link from Booking.com, Google Hotels, or Agoda"
- Loading state displays progress: "Checking cache..." → "Fetching reviews..." → "Analyzing with AI..." → "Calculating True Score..."
- Error handling for invalid URLs or unsupported platforms
- Mobile-responsive input and button
- Analysis typically completes in <60 seconds (or <5 seconds if cached)

**WHY URL-ONLY:**
- Eliminates ambiguity (no "Which Marriott in NYC?")
- 100% accuracy in hotel identification
- Simplifies Apify API integration
- Prevents wasted API calls on wrong properties

**V2 Feature:** Add "Search by Name" with autocomplete and hotel selection

**US-102: View True Score and Platform Breakdown (P0)**

**As a** traveler  
**I want to** see the hotel's True Score with transparent calculation  
**So that** I can understand how the rating was determined

**Acceptance Criteria:**
- True Score displayed prominently (0-10 scale) with color coding:
  - 8.0-10.0: Green (Excellent)
  - 6.0-7.9: Yellow (Good)
  - 4.0-5.9: Orange (Average)
  - 0-3.9: Red (Poor)
- Breakdown table shows contribution from each platform:
  - Platform name (TripAdvisor, Booking.com, Google)
  - Original score (normalized to 0-10)
  - Number of reviews analyzed
  - Number of reviews filtered as suspicious
- Total reviews analyzed vs. total reviews filtered clearly displayed
- Explanation of weighting methodology (tooltip or expandable section)
- Mobile-optimized table layout

**US-103: View AI-Generated Highlights (P0)**

**As a** traveler  
**I want to** see specific positive aspects of the hotel  
**So that** I can quickly understand what's good without reading hundreds of reviews

**Acceptance Criteria:**
- "Highlights" section lists 3-5 positive aspects
- Each highlight includes:
  - Specific aspect (e.g., "Breakfast Quality", "Location Convenience")
  - Natural language description with concrete examples
  - Frequency indicator (e.g., "mentioned by 78% of recent guests")
- Highlights are specific, not generic (e.g., "Rooftop pool praised for city views" not just "Nice pool")
- Ordered by frequency/importance
- Expandable for more detail (optional)

**US-104: View AI-Generated Lowlights (P0)**

**As a** traveler  
**I want to** see specific negative aspects or common complaints  
**So that** I can make an informed decision about potential drawbacks

**Acceptance Criteria:**
- "Lowlights" section lists 3-5 negative aspects
- Each lowlight includes:
  - Specific aspect (e.g., "Noise Levels", "Check-in Wait Times")
  - Natural language description with concrete examples
  - Frequency indicator
- Lowlights are specific, not vague (e.g., "Street-facing rooms experience traffic noise until midnight" not just "Noisy")
- Ordered by frequency/severity
- Balanced tone (factual, not alarmist)

#### Epic 2: Transparency and Trust

**US-201: View Filtered Review Details (P1)**

**As a** skeptical traveler  
**I want to** understand why certain reviews were filtered  
**So that** I can trust the True Score calculation

**Acceptance Criteria:**
- "Suspicious Reviews" section shows count and percentage
- Expandable section lists common reasons for filtering:
  - "Generic language patterns detected in X reviews"
  - "Review burst detected (Y reviews in Z days)"
  - "Extreme sentiment without specific details in W reviews"
- Option to "Show Examples" displays 2-3 sample filtered reviews with highlighting
- Clear explanation that filtered reviews don't contribute to True Score
- Reassurance messaging about transparency

**US-202: Access Booking Platform Links (P1)**

**As a** traveler ready to book  
**I want to** easily navigate to booking platforms  
**So that** I can complete my reservation

**Acceptance Criteria:**
- "Book This Hotel" section with buttons/links for:
  - Booking.com
  - Agoda
  - TripAdvisor
  - Google Hotels
- Links open in new tab
- Affiliate tracking implemented (if applicable)
- Simple, non-intrusive placement below analysis results
- Mobile tap-friendly buttons

#### Epic 3: User Experience

**US-301: View Analysis Loading Progress (P0)**

**As a** user waiting for analysis  
**I want to** see progress updates  
**So that** I know the system is working and how long to wait

**Acceptance Criteria:**
- Loading states show current step:
  1. "Searching for hotel..." (5-10s)
  2. "Fetching reviews from TripAdvisor, Booking.com, Google..." (20-30s)
  3. "Analyzing reviews with AI..." (15-25s)
  4. "Calculating True Score..." (2-5s)
- Progress bar or spinner animation
- Estimated time remaining (optional)
- Prevents duplicate submissions during analysis
- Error state with clear message if analysis fails

**US-302: Share Analysis Results (P1)**

**As a** user who found valuable insights  
**I want to** share the analysis with travel companions  
**So that** we can make decisions together

**Acceptance Criteria:**
- "Share" button generates shareable link
- Link contains hotel identifier and cached results (24-hour expiration)
- Sharing options: Copy Link, WhatsApp, Email
- Shared page shows same analysis results
- Social meta tags for preview in messaging apps

**US-303: Responsive Mobile Experience (P0)**

**As a** mobile user  
**I want to** use hotelcritic on my phone  
**So that** I can analyze hotels while traveling

**Acceptance Criteria:**
- All UI elements optimized for mobile screens (320px width minimum)
- Touch-friendly buttons and inputs (minimum 44px touch targets)
- Readable font sizes without zooming
- Tables adapt to narrow screens (stacked or scrollable)
- Fast loading on 3G/4G connections
- Works on iOS Safari and Android Chrome

### 6.2 MVP Feature Priority Matrix

| Feature | Priority | Phase | Dependencies | Est. Effort |
|---------|----------|-------|--------------|-------------|
| Hotel URL/name input | P0 | MVP Week 1 | None | 2 days |
| Apify API integration | P0 | MVP Week 1 | Apify account setup | 3 days |
| Claude API integration | P0 | MVP Week 1-2 | Anthropic API key | 4 days |
| True Score calculation | P0 | MVP Week 2 | Review data | 3 days |
| Highlights/lowlights display | P0 | MVP Week 2 | Claude analysis | 2 days |
| Platform breakdown table | P0 | MVP Week 2 | Review data | 2 days |
| Loading progress states | P0 | MVP Week 3 | None | 2 days |
| Mobile responsive design | P0 | MVP Week 3 | Basic UI | 3 days |
| Filtered review transparency | P1 | MVP Week 3 | Claude analysis | 2 days |
| Booking platform links | P1 | MVP Week 3 | None | 1 day |
| Share analysis results | P1 | Post-MVP | URL routing | 2 days |
| Error handling | P0 | MVP Week 2 | API integration | 2 days |

**Total MVP Effort: ~3 weeks for 1 full-stack developer**

### 6.3 Out of Scope for MVP

The following features are explicitly NOT included in MVP to maintain focus:

- ❌ User accounts and authentication
- ❌ Saved/favorite hotels
- ❌ Hotel search and browse functionality
- ❌ Database or data persistence
- ❌ Price comparison across platforms
- ❌ Discount codes or coupons
- ❌ Photo galleries (official vs. user)
- ❌ Social media video integration
- ❌ Email notifications or price alerts
- ❌ Admin dashboard
- ❌ Review reporting system
- ❌ Multi-language support
- ❌ Advanced filtering and sorting

These features will be considered for V2 based on MVP user feedback and traction.

---

## 7. OPERATIONAL COST ANALYSIS

### 7.1 MVP Cost Breakdown (Per Hotel Analysis)

| Cost Component | Service | Unit Cost | Notes |
|----------------|---------|-----------|-------|
| **Review Aggregation** | Apify API (hotel-review-aggregator) | $0.10 - $0.25 | Depends on hotel size, avg 500 reviews |
| **AI Analysis** | Claude Sonnet 4 API | $0.15 - $0.25 | ~500 reviews × 300 tokens × $3/1M input tokens + output |
| **Hosting** | Vercel (Free tier) | $0.00 | Generous free tier (100GB bandwidth, unlimited requests) |
| **Monitoring** | Sentry (Free tier) | $0.00 | Up to 5K errors/month free |
| **Domain & SSL** | Vercel included | $0.00 | Free custom domain and SSL |
| **Total per Analysis** | | **$0.25 - $0.50** | Average: ~$0.35 |

### 7.2 Monthly Cost Projections

#### Scenario 1: Low Traffic (100 analyses/day)

| Item | Calculation | Monthly Cost |
|------|-------------|--------------|
| Apify API | 100 × 30 × $0.15 | $450 |
| Claude API | 100 × 30 × $0.20 | $600 |
| Hosting (Vercel) | Free tier sufficient | $0 |
| **Total Monthly** | | **$1,050** |
| **Cost per User** | Assuming 50% conversion from visit to analysis | $0.70 |

#### Scenario 2: Medium Traffic (500 analyses/day)

| Item | Calculation | Monthly Cost |
|------|-------------|--------------|
| Apify API | 500 × 30 × $0.15 | $2,250 |
| Claude API | 500 × 30 × $0.20 | $3,000 |
| Hosting (Vercel Pro) | May need Pro tier | $20 |
| **Total Monthly** | | **$5,270** |
| **Cost per User** | Assuming 50% conversion | $0.70 |

#### Scenario 3: High Traffic (1,000 analyses/day)

| Item | Calculation | Monthly Cost |
|------|-------------|--------------|
| Apify API | 1,000 × 30 × $0.15 | $4,500 |
| Claude API | 1,000 × 30 × $0.20 | $6,000 |
| Hosting (Vercel Pro) | Pro tier | $20 |
| **Total Monthly** | | **$10,520** |
| **Cost per User** | Assuming 50% conversion | $0.70 |

### 7.3 Cost Optimization Strategies

#### Immediate Optimizations (MVP - Already Included)

**1. 24-Hour Lightweight Cache (CRITICAL - Already in MVP)**
- Use Vercel KV (Redis-compatible) for caching analysis results
- Cache key: MD5 hash of hotel URL
- Cache TTL: 24 hours
- Implementation: 1 day effort in Week 1
- Estimated cache hit rate: 30-50% at scale
- Savings: $3,000-$5,000/month at 1,000 analyses/day
- **This is NON-NEGOTIABLE for MVP - prevents duplicate API costs**

**2. Limit Review Count per Platform**
- Current: Fetch up to 500 reviews per platform
- Optimization: Limit to 200 most recent reviews
- Savings: ~30% reduction in Apify costs
- Impact: Minimal (most insights come from recent reviews)

**3. Claude Token Optimization**
- Current: Send all review text to Claude
- Optimization: Pre-filter reviews >500 words, summarize before sending
- Savings: ~20% reduction in Claude API costs
- Impact: None (quality maintained)

**3. Smart Caching (Simple Implementation)**
- Cache results in URL parameter for 24 hours
- Users sharing links don't trigger new analysis
- Estimated savings: 15-20% of repeat requests

**Combined MVP Savings: ~40% → Cost per analysis drops to $0.20-0.30**

#### V2 Optimizations (When Cost Becomes Prohibitive)

**1. Build Custom Scraping Engine**
- Replace Apify with Playwright-based scraper
- Cost: ~$0.05 per analysis (vs. $0.15 Apify)
- Savings: 66% reduction in scraping costs
- Investment: 2-3 weeks development time

**2. Add PostgreSQL Database with Smart Caching**
- Cache popular hotels (top 10% of requests)
- Refresh every 7 days instead of real-time
- Estimated savings: 50-70% of total API costs for cached hotels
- Cost: $25/month for managed PostgreSQL (Supabase/Railway)

**3. Fine-Tune Lighter AI Model**
- Train lightweight fake-review classifier (replaces Claude for detection)
- Use Claude only for summarization
- Savings: ~50% reduction in Claude costs
- Investment: 1-2 weeks + $500 training costs

**V2 Combined Savings: ~70% → Cost per analysis drops to $0.10-0.15**

### 7.4 Revenue Model and Unit Economics

#### MVP Revenue Assumptions (Conservative)

| Metric | Value | Notes |
|--------|-------|-------|
| Affiliate Click-Through Rate | 8% | Lower than industry avg (12%) for MVP |
| Affiliate Conversion Rate | 2% | Conservative booking conversion |
| Average Booking Value | $200 | Mid-range hotel average |
| Affiliate Commission Rate | 4% | Typical OTA commission |
| **Revenue per Analysis** | **$0.13** | 8% × 2% × $200 × 4% |

#### Break-Even Analysis

At $0.35 cost per analysis and $0.13 revenue per analysis:
- **Net Loss per Analysis: -$0.22**
- **Monthly Loss at 100 analyses/day: -$660**
- **Monthly Loss at 500 analyses/day: -$3,300**

**Path to Profitability:**

1. **Cost Optimization** (V2): Reduce cost to $0.15 per analysis
2. **Conversion Optimization** (V2): Increase CTR to 12% and conversion to 3%
   - New revenue per analysis: $0.29
3. **Net Profit per Analysis: +$0.14**
4. **Break-even at ~150 analyses/day**

### 7.5 Funding Requirements for MVP

#### 3-Month MVP Budget

| Category | Cost | Notes |
|----------|------|-------|
| **Development** | $15,000 | 1 full-stack developer × 3 months @ $5K/month |
| **API Costs** | $3,000 | ~100 analyses/day × 90 days @ $0.35 |
| **Marketing/Testing** | $2,000 | Initial user acquisition, beta testing |
| **Domain/Tools** | $500 | Domain, design tools, misc. |
| **Buffer (20%)** | $4,100 | Unexpected costs |
| **Total MVP Budget** | **$24,600** | Covers 3 months to launch and validate |

#### Success Metrics to Justify V2 Investment

After 3 months, proceed to V2 if:
- ✅ NPS ≥ 60 for True Score accuracy
- ✅ >80% of users find AI summaries "helpful"
- ✅ Affiliate CTR ≥ 6% (shows monetization potential)
- ✅ 1,000+ successful analyses completed
- ✅ <5% error rate in analysis completion

If metrics not met, iterate on MVP before scaling.

---

## 8. IMPLEMENTATION PLAN

### 8.1 MVP Development Timeline (3 Weeks)

**Objective:** Launch minimal viable product that validates core value proposition - users provide hotel URL, receive True Score with AI insights in <60 seconds.

#### Week 1: Foundation and API Integration

**Days 1-2: Project Setup**
- Initialize Next.js project with Tailwind CSS
- Set up Vercel deployment pipeline
- Configure environment variables for API keys
- Create basic UI mockup in Figma/Sketch
- **Deliverable:** Deployed Next.js app with placeholder homepage

**Days 3-4: Apify Integration + Caching Setup**
- Create Apify account and test hotel-review-aggregator API
- Set up Vercel KV (Redis) for 24-hour caching
- Build backend API route `/api/analyze-hotel` with cache check
- Implement hotel URL parsing and validation (URL-only, no name search)
- Test Apify API with 10+ sample hotels
- Handle Apify errors and edge cases
- **Deliverable:** Working Apify integration with caching that fetches review data

**Days 5-7: Claude API Integration + CRITICAL Prompt Validation**
- Set up Anthropic API account and test Claude Sonnet 4
- Design initial prompt template for review analysis
- **CRITICAL FOCUS: Prompt Engineering & Validation (2.5 days)**
  - Create "gold set" of 20 hotels with known fake/real review patterns
  - Test multiple prompt variations against gold set
  - Iterate on few-shot examples to improve detection accuracy
  - Balance false positive (filtering real reviews) vs. false negative (keeping fake reviews) rates
  - Target: 75%+ accuracy on gold set (perfectionism can wait for V2)
  - Implement simple rule-based pre-filtering (short reviews, duplicates, spam patterns)
- Extract highlights/lowlights with specific examples
- **Deliverable:** AI analysis pipeline with validated, tested prompts

#### Week 2: Core Features and True Score

**Days 8-10: True Score Calculation + Edge Cases**
- Implement scoring algorithm with weighting:
  - Recency weighting (last 3 months = 2x)
  - Platform credibility multipliers
  - Review length/specificity bonus
- **NEW: Minimum review threshold logic (≥25 reviews required)**
- Build platform breakdown data structure
- Calculate suspicious review percentage
- Normalize scores to 0-10 scale
- **Edge case handling:**
  - New hotels with <25 reviews: Show "Insufficient Data" state
  - >70% reviews flagged: Warning message
  - <15 reviews after filtering: Cannot generate score
  - Single platform only: Reduced confidence indicator
- **Deliverable:** True Score calculation with edge case handling

**Days 11-12: Frontend UI**
- Build homepage with hotel input field
- Create loading states with progress indicators
- Design results page layout:
  - True Score display (large, color-coded)
  - Platform breakdown table
  - Highlights section
  - Lowlights section
  - Booking platform links
- Mobile-responsive design
- **Deliverable:** Complete UI for hotel analysis workflow

**Days 13-14: Integration and Polish**
- Connect frontend to backend API
- Implement error handling and user feedback
- Add input validation (URL format, hotel name)
- Test end-to-end workflow
- Loading state UX improvements
- **Deliverable:** Fully functional MVP

#### Week 3: Critical Features, Testing, and Launch

**Days 15-16: Budget Cap + Rate Limiting (CRITICAL)**
- Implement daily budget cap kill-switch ($100/day default)
- Track cumulative API costs in Redis
- Add "At Capacity" message when limit hit
- Set up admin alerts (email/Slack) when approaching cap
- Implement IP-based rate limiting (10 requests/hour)
- Test budget cap with mock high-volume traffic
- **Deliverable:** Protection against viral bill surprise

**Days 17-18: Confidence Indicators + Data Freshness**
- Add AI confidence score to results ("High/Medium/Low Confidence")
- Display data freshness timestamp ("Analyzed Jan 19, 2026")
- Show cache age if applicable ("Cached 3 hours ago" vs "Freshly analyzed")
- Add "Show Your Work" tooltips explaining calculation
- Test with 50+ different hotels across all edge cases
- **Deliverable:** Transparent, trustworthy results display

**Days 19-20: Beta Launch + Legal Basics**
- Deploy to production on Vercel
- Set up custom domain (hotelcritic.com)
- Create simple landing page explaining the product
- Add Privacy Policy and Terms of Service (use templates)
- Add disclaimer about transformative fair use
- Share with 10-20 beta testers
- Collect initial feedback via post-analysis survey
- **Deliverable:** Live MVP accepting real users

**Day 21: Critical Bug Fixes + Final Polish**
- Address P0 bugs from beta testing
- Adjust AI prompts if summaries receiving <75% helpfulness
- Fine-tune loading times and error messages
- Verify budget cap and rate limiting working
- **Deliverable:** Production-ready MVP for broader launch

### 8.2 Team Composition

**MVP Team (Minimal):**
- 1 Full-Stack Developer (Next.js, React, API integration)
  - Skills: Frontend (React, Tailwind), Backend (Next.js API routes, API integration)
  - Time commitment: Full-time for 3 weeks
- **Total: 1 person**

**Optional Support:**
- UI/UX Designer (contract, 2-3 days for mockups and design system)
- Beta Testers (10-20 volunteers from target audience)

### 8.3 Technology Stack Summary (MVP)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14, React, Tailwind CSS, shadcn/ui | Web application UI |
| Backend | Next.js API Routes | Serverless API endpoints |
| Hosting | Vercel (Free tier) | Deployment and hosting |
| Review Aggregation | Apify API (hotel-review-aggregator) | Multi-platform review fetching |
| AI Analysis | Claude Sonnet 4 (Anthropic API) | Fake review detection + summarization |
| Monitoring | Sentry (Free tier) | Error tracking |
| Analytics | Vercel Analytics (included) | Basic usage metrics |

**No Database Required for MVP** - Stateless, on-demand processing only

### 8.4 Post-MVP Roadmap (V2+)

#### V2: Cost Optimization and User Accounts (Month 2-3)

**When to Build:** When daily analyses exceed 500 or costs exceed $5,000/month

**Features:**
- Add PostgreSQL database for caching popular hotels (reduce Apify costs 50-70%)
- Build custom scraping engine to replace Apify ($0.05 vs. $0.15 per analysis)
- Implement user accounts (Auth0) for saved searches
- Add price comparison from affiliate APIs
- Discount code integration

**Investment:** 1 developer × 6-8 weeks

**Expected Impact:**
- Cost per analysis: $0.35 → $0.10
- Affiliate CTR: 8% → 12% (with price comparison)
- Break-even point reached

#### V3: Photo Comparison and Social Proof (Month 4-6)

**When to Build:** When MAU exceeds 10,000 and NPS validates core product

**Features:**
- Photo gallery (official vs. user-generated photos)
- Computer vision for photo classification
- Social media video integration (TikTok, Instagram, YouTube)
- User-uploaded photos
- Price alerts and notifications

**Investment:** 1 developer + 1 ML engineer × 8 weeks

**Expected Impact:**
- Session duration: 3 min → 8 min
- User trust: NPS 60 → 70+
- Viral sharing potential from video content

#### V4: Scale and Automation (Month 7-12)

**When to Build:** When reaching capacity limits or expanding markets

**Features:**
- Automated scraping scheduler (proactive data updates)
- Advanced search and filtering
- Hotel recommendations based on preferences
- Multi-language support
- Mobile app (iOS/Android)

**Investment:** 2 developers + 1 DevOps × 12 weeks

**Expected Impact:**
- Support 100,000+ hotels
- International expansion
- Mobile-first user base

### 8.5 Risk Mitigation

**Risk 1: Apify API Becomes Too Expensive at Scale**
- **Likelihood:** Medium-High
- **Mitigation:** Build custom scraping engine in V2, cost drops from $0.15 to $0.05
- **Trigger:** Monthly Apify costs exceed $3,000

**Risk 2: Claude API Costs Exceed Revenue**
- **Likelihood:** High (expected for MVP)
- **Mitigation:** Fine-tune lightweight fake review classifier, use Claude only for summaries
- **Trigger:** Monthly Claude costs exceed $5,000
- **Long-term:** Train custom models, cost drops from $0.20 to $0.02 per analysis

**Risk 3: Insufficient Affiliate Conversion**
- **Likelihood:** Medium
- **Mitigation:** A/B test CTA placement, add price comparison to increase CTR
- **Trigger:** CTR below 6% after 1,000 analyses
- **Pivot:** Consider subscription model ($9.99/month for unlimited analyses)

**Risk 4: Apify API Unreliability**
- **Likelihood:** Low-Medium
- **Mitigation:** Implement retry logic, cache successful results for 24 hours
- **Trigger:** >10% failure rate on Apify calls
- **Backup:** Accelerate custom scraping engine development

**Risk 5: Low User Adoption**
- **Likelihood:** Medium
- **Mitigation:** Iterate on MVP based on user feedback, focus on marketing/SEO
- **Trigger:** <500 analyses in first month
- **Pivot:** Adjust messaging, target different user segment (e.g., travel bloggers)

### 8.6 Legal and Compliance Risks

#### Scraping and Terms of Service

**Risk:** Aggregating hotel reviews may violate platform Terms of Service

**Specific Concerns:**
- Booking.com ToS prohibits automated scraping
- Google's robots.txt restricts certain automated access
- Displaying scraped content without permission creates legal exposure

**Mitigation Strategies:**

1. **Transformative Use (Fair Use Defense):**
   - DO NOT display raw review text
   - DO NOT quote reviews verbatim in summaries
   - DO use AI to create transformative analysis (highlights/lowlights in our own words)
   - Provide clear value-add beyond original content

2. **Attribution and Links:**
   - Include prominent "View original reviews on [Platform]" links
   - Drive traffic back to source platforms (reduces harm argument)
   - Frame as "review analysis tool" not "review aggregator"

3. **Apify Intermediation:**
   - Apify handles technical scraping (reduces direct liability)
   - Apify's ToS covers their scraping methodology
   - Our contract is with Apify, not with OTAs directly

4. **Cease and Desist Response Plan:**
   - If contacted by platform legal team:
     - Remove that platform from scraping immediately
     - Respond professionally via legal counsel
     - Pivot to API partnerships if available
   - Budget: $2,000 for initial legal consultation

5. **Copyright Considerations:**
   - Review text = facts (generally not copyrightable)
   - Hotel names/addresses = factual data (OK to use)
   - Hotel photos = copyrighted (do not scrape/display without license)

**Action Items Before Launch:**
- Consult with tech startup attorney ($500-1,000 consultation)
- Draft Terms of Service stating we are not affiliated with platforms
- Implement DMCA takedown process
- Add disclaimer: "Reviews aggregated from public sources for analysis purposes"

#### Data Privacy (GDPR/CCPA)

**Low Risk for MVP:**
- No user accounts = no personal data collected
- No cookies beyond analytics = minimal tracking
- Reviewer names from public reviews = already public information

**Required:**
- Privacy Policy page (use template, customize)
- Cookie consent banner for EU visitors
- "Do Not Sell My Data" link for California (even if not selling data)
- ✅ 95%+ analysis completion rate (successful API calls)
- ✅ <60 second average analysis time (p95)
- ✅ <5% error rate across all hotel types
- ✅ 99%+ uptime on Vercel hosting

**Product Validation (Must Achieve):**
- ✅ NPS ≥ 60 for True Score accuracy
- ✅ 80%+ of users find AI summaries "helpful" (post-analysis survey)
- ✅ 1,000+ successful analyses completed within 3 months
- ✅ <30% bounce rate on results page

**Business Viability (Nice to Have for MVP):**
- ✅ Affiliate CTR ≥ 6%
- ✅ 20%+ users return for second analysis within 30 days
- ✅ Organic sharing (10%+ of users share results)

**Decision Matrix After 3 Months:**

| Scenario | Action |
|----------|--------|
| All technical + product criteria met, affiliate CTR ≥6% | ✅ Proceed to V2 (cost optimization) |
| All technical + product criteria met, affiliate CTR <6% | 🔄 Iterate on monetization before V2 |
| Technical criteria met, NPS <60 or helpfulness <80% | 🔄 Iterate on AI quality before scaling |
| Technical criteria not met (high error rate, slow) | 🛑 Fix technical issues before marketing |
| <500 analyses in 3 months | 🛑 Re-evaluate product-market fit |

---

## 9. SUCCESS METRICS

### 9.1 MVP Key Performance Indicators (3-Month Horizon)

#### Product Validation Metrics

| KPI | Baseline (Launch) | Month 1 Target | Month 2 Target | Month 3 Target | Measurement Method |
|-----|-------------------|----------------|----------------|----------------|-------------------|
| Successful Analyses Completed | 0 | 100 | 500 | 1,000 | Backend logging |
| Analysis Success Rate | N/A | 95% | 97% | 98% | Successful completions / total attempts |
| Average Analysis Time (p95) | N/A | <75 sec | <65 sec | <60 sec | Backend timing logs |
| User Satisfaction (NPS) | N/A | N/A | 55+ | 60+ | Monthly post-analysis survey |
| AI Summary Helpfulness | N/A | N/A | 75% | 80% | Post-analysis survey: "Was this helpful?" |
| Return User Rate (7-day) | N/A | 10% | 20% | 25% | Analytics tracking |

#### Technical Performance Metrics

| KPI | Target | Measurement Method |
|-----|--------|-------------------|
| Page Load Time (p95) | <2 seconds | Vercel Analytics |
| Error Rate | <5% | Sentry error tracking |
| Apify API Success Rate | >90% | Backend logging |
| Claude API Success Rate | >95% | Backend logging |
| Mobile Usability | 90%+ mobile traffic supported | Google Analytics device breakdown |

#### Cost Metrics

| KPI | Month 1 | Month 2 | Month 3 | Measurement Method |
|-----|---------|---------|---------|-------------------|
| Cost per Analysis | $0.40 | $0.35 | $0.30 | Total API costs / analyses |
| Total Monthly Costs | ~$500 | ~$2,000 | ~$4,000 | Apify + Claude + hosting invoices |
| Analyses per Dollar | 2.5 | 2.9 | 3.3 | Inverse of cost per analysis |

#### Early Business Signals (Optional for MVP)

| KPI | Month 3 Target | Measurement Method |
|-----|----------------|-------------------|
| Affiliate Click-Through Rate | 6%+ | Link click tracking |
| Social Shares | 10%+ of users | Share button analytics |
| Organic Traffic | 30%+ of total | Google Analytics referral source |
| Bounce Rate | <40% | Google Analytics |

### 9.2 Measurement Methods and Tools

**Daily Monitoring:**
- Error rate and API failures (Sentry dashboard)
- Successful analyses completed (custom logging)
- Average analysis time trends

**Weekly Reviews:**
- User feedback from post-analysis surveys
- Cost tracking (Apify + Claude invoices)
- Top error patterns requiring fixes

**Monthly Business Reviews:**
- NPS survey to 50-100 recent users
- Detailed cost analysis and optimization opportunities
- User behavior patterns (return rate, sharing, affiliate clicks)
- Decision on whether to proceed to V2

### 9.3 MVP Success Criteria (Go/No-Go for V2)

**After 3 months, evaluate against these criteria:**

#### ✅ MUST ACHIEVE (Technical & Product)

| Criterion | Target | Why It Matters |
|-----------|--------|----------------|
| **Analyses Completed** | 1,000+ | Validates sufficient user interest |
| **Success Rate** | 95%+ | Proves technical reliability |
| **Average Time** | <60 sec (p95) | Meets user expectation for speed |
| **NPS** | 40+ | Realistic V1 target (Apple/Tesla are 60+) - validates basic trust |
| **Helpfulness (NORTH STAR)** | 80%+ | Confirms AI summaries provide value - more important than NPS for MVP |

#### 🎯 NICE TO HAVE (Business Signals)

| Criterion | Target | Why It Matters |
|-----------|--------|----------------|
| **Affiliate CTR** | 6%+ | Early signal of monetization potential |
| **Return Users** | 25%+ | Indicates product stickiness |
| **Social Shares** | 10%+ | Organic growth potential |
| **Cost per Analysis** | <$0.35 | Approaching sustainable economics |

### 9.4 Decision Matrix

| Outcome | Action |
|---------|--------|
| **✅ All "Must Achieve" + 2+ "Nice to Have"** | Proceed to V2 (cost optimization & user accounts). Secure $50K funding for V2 development. |
| **✅ All "Must Achieve" + 0-1 "Nice to Have"** | Iterate on MVP for 1 more month. Focus on improving weak "Nice to Have" metrics before V2. |
| **⚠️ Missing 1 "Must Achieve" criterion** | Address specific gap before V2. If NPS/Helpfulness low → improve AI quality. If Success Rate low → fix technical issues. |
| **❌ Missing 2+ "Must Achieve" criteria** | Major pivot required. Re-evaluate product-market fit, consider alternative approaches or sunset project. |
| **📊 <500 analyses in 3 months** | Product-market fit not validated. Conduct user interviews to understand barriers. Consider pivot to different user segment or use case. |

### 9.5 User Feedback Collection

**Post-Analysis Survey (Triggered After Each Analysis):**

Simple 2-question survey:
1. "How accurate did you find the True Score?" (0-10 NPS scale)
2. "Were the AI highlights/lowlights helpful?" (Yes / Somewhat / No)

Optional open-ended: "Any feedback to improve hotelcritic?"

**Monthly Deep-Dive Interviews:**
- Recruit 5-10 users who completed 2+ analyses
- 15-minute video calls
- Questions:
  - What problem were you trying to solve?
  - How did hotelcritic compare to your usual research process?
  - What would make you use this regularly?
  - Would you pay for this? If yes, how much?

### 9.6 Iteration and Optimization

**A/B Testing Priorities (if traffic allows):**

1. **True Score Display** - Test numeric (8.3) vs. letter grade (B+) vs. stars (★★★★☆)
2. **Highlights/Lowlights Length** - Test 3 points vs. 5 points vs. "Show More" expandable
3. **Loading Experience** - Test progress bar vs. spinner vs. step-by-step updates
4. **CTA Placement** - Test booking links above vs. below AI summary

**Prompt Optimization (Continuous):**
- Review 20 random AI summaries weekly
- Identify patterns of unhelpful/generic summaries
- Refine Claude prompts to be more specific
- Test new prompts on sample hotels before deploying

**Cost Optimization (Monthly):**
- Analyze which hotels take longest (most reviews)
- Implement smarter review limiting strategy
- Test reduced max reviews (200 vs. 500) on sample set
- Monitor impact on summary quality

### 9.7 Competitive Benchmarking

**Track these competitors monthly:**

| Competitor | What to Monitor |
|------------|-----------------|
| **TripAdvisor** | New AI features, review verification changes |
| **Booking.com** | Review aggregation tools, verified reviews |
| **Google Travel** | AI summaries or review filtering features |
| **AI Review Tools** (e.g., ReviewMeta, Fakespot) | New hotel/travel expansion |

**Key Questions:**
- Are they building similar AI-powered review analysis?
- How are they handling fake reviews?
- What's their monetization strategy?
- Are we differentiated enough?

### 9.8 Exit Criteria

**When to Sunset the Project:**

If after 3 months + 1 month iteration:
- ❌ <500 total analyses completed
- ❌ NPS <50
- ❌ <70% find summaries helpful
- ❌ User feedback consistently negative
- ❌ No clear path to monetization (CTR <3%)

**OR** if external factors change:
- Major platform changes block scraping entirely
- Competitor launches superior free product
- Regulatory changes make business model untenable

**Lessons Learned Document:**
Even if sunset, document:
- What worked (e.g., AI summarization quality)
- What didn't work (e.g., user acquisition, monetization)
- Reusable assets (code, prompts, learnings)
- Potential pivots (e.g., B2B hotel analytics tool)

---

## APPENDICES

### Appendix A: Glossary

- **True Score:** hotelcritic's proprietary 0-10 rating that aggregates and verifies reviews from multiple platforms
- **Suspicious Review:** A review flagged by AI as potentially fake or manipulated, excluded from True Score calculation
- **Trust Score:** 0-100 score assigned to individual reviews indicating authenticity likelihood
- **Verified Review:** Review that passes trust threshold (40+) and contributes to True Score
- **Platform Score:** The rating a hotel receives on a specific platform (e.g., TripAdvisor score)
- **Aspect:** A specific hotel attribute (cleanliness, location, service, etc.) extracted from reviews

### Appendix B: References

- World Economic Forum Report on Fake Reviews (2023)
- Phocuswright Online Travel Market Report (2024)
- Cornell University Study on Review Manipulation
- Consumer Reports Survey on Hotel Booking Trust

### Appendix C: Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-19 | Initial PRD creation | Product Team |

---

**Document Status:** Draft - Ready for Development  
**Next Review Date:** 2026-02-19  
**Approvals Required:** Engineering Lead, CTO, CEO

