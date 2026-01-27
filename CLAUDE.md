# CLAUDE.md
## Project Goals
**Current milestone:** MVP - users provide hotel URL, receive True Score with AI insights in <60 seconds.

## Architecture
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
## Design Style Guide
**Tech stack:** Next.js (App Router), Tailwind CSS, Shadcn UI
**Visual style:**
- Clean, minimal interface - the thumbnail is the star
- Use Shadc components for consistency
- Responsive design (mobile-first)
- No dark mode for MVP
**Component patterns:**
- Shadcn UI for all interactive elements (buttons, inputs, cards)
- Tailwind for layout and spacing
- Keep components focused and small
## Product & UX Guidelines
**Core UX principles:**
- Speed over perfection - get thumbnails fast, iterate quickly
- Show the enhanced prompt - it's educational for the user
- One-click regenerate - easy to try again
- Instant download - no extra steps
**Copy tone:**
- Casual, friendly, creator-focused
- Brief labels and instructions
- Helpful error messages that suggest next steps
**Ul zones (top to bottom):**
1. Header - just logo/name
2. Input - prompt textarea + generate button
3. Output - loading state, enhanced prompt (collapsible), thumbnail, download/regenerate

## Constraints & Policies
**Security - MUST follow:**
- NEVER expose APIFY_API_TOKEN or ANTHROPIC_API_KEY to the client - server-side only
- ALWAYS use environment variables for secrets
- NEVER commit 'env local' or any file with API keys
- Validate and sanitize all user input
**Code quality:**
- TypeScript strict mode
- Run 'npm run lint' before committing
- No 'any' types without justification
**Dependencies:**
- Prefer Shadcn components over adding new UI libraries
- Minimize external dependencies for MVP

## Repository Etiquette
**Branching:**
- ALWAYS create a feature branch before starting major changes
- NEVER commit directly to 'main"
- Branch naming: 'feature/description' or 'fix/description*
**Git workflow for major changes:**
1. Create a new branch: 'git checkout -b feature/your-feature-name*
2. Develop and commit on the feature branch
3. Test locally before pushing:
- 'npm run dev' - start dev server at localhost: 3000
- 'npm run lint' - check for linting errors
- 'npm run build' - production build to catch type errors
4. Push the branch: 'git push -u origin feature/your-feature-name*
5. Create a PR to merge into 'main"
6. Use the '/update-docs-and-commit' slash command for commits - this ensures docs are updated alongside code changes
**Commits:**
- Write clear commit messages describing the change
- Keep commits focused on single changes
**Pull Requests:**
- Create PRs for all changes to 'main"
- NEVER force push to 'main"
- Include description of what changed and why
**Before pushing:**
1. Run 'npm run lint'
2. Run 'npm run build to catch type errors

3. Test the feature manually
## Commands
```bash
# Development
npm run dev 
npm run build 
npm run start
 npm run lint
# Shadcn UI
npx shadn@latest add [component]
```

# Start dev server at localhost:3000
# Production build (also catches type errors)
# Run production build locally
# ESLint check Add new Shadcn component
## Testing
**MVP approach:** Manual testing (no automated tests yet)

## Documentation
- [Project Spec] (project_spec.md) - Full requirements, API specs, tech details
- [Architecture] (docs/architecture.md) - System design and data flow
- [Changelog] (docs/changelog.md) - Version history
- [Project Status] (docs/project_status.md) - Current progress
- Update files in the docs folder after major milestones and major additions to the project.
- Use the /update-docs-and-commit slash command when making git