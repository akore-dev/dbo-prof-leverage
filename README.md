# Professional Leverage Diagnostic

A full-stack diagnostic experience that helps experienced professionals identify gaps between the value they create and the way that value is understood, trusted, and leveraged.

**Live product:** [profleverage.com](https://profleverage.com)

## Why this project exists

Professionals often feel stalled without being able to name the underlying pattern. This product turns a short, structured assessment into a personalized narrative covering identity clarity, evidence visibility, positioning, trust, next-move clarity, and leverage utilization.

The project goes beyond a static questionnaire: it generates an AI-assisted interpretation, creates portable result links, supports referral attribution, tracks unlock progress, and provides a protected operational dashboard.

## Product flow

1. A visitor completes the five-minute blind-spot assessment.
2. The browser validates and compresses the scores into a URL-safe payload.
3. The server generates a structured interpretation without exposing the AI key to the client.
4. A long-form results experience reveals patterns, quiet costs, hidden value, and possible next steps.
5. Visitors can share a signed referral link and track progress toward a debrief.
6. Administrators can review aggregate referral activity through an authenticated dashboard.

## Highlights

- Responsive React assessment and editorial results experience
- Structured server-side AI interpretation with input and output validation
- Compressed, URL-safe result payloads with backwards-compatible decoding
- Signed referral codes, idempotent completion tracking, and PostgreSQL persistence
- Expiring HMAC-signed admin sessions in `HttpOnly`, `SameSite=Strict` cookies
- Route-specific canonical, Open Graph, Twitter, and robots metadata
- Vercel serverless and Fly.io container deployment configurations
- Focused UI and data-serialization tests

## Architecture

```text
React client
  ├─ Assessment and result presentation
  ├─ URL-safe score/result serialization
  └─ Referral and admin interfaces
          │
          ▼
Node API handlers
  ├─ AI interpretation
  ├─ Signed referral workflow
  └─ Admin authentication and reporting
          │
          ▼
PostgreSQL
```

The same API handlers are used by Vercel functions and by the small Node production server in `server.js`.

## Tech stack

- React 18 and React Router
- Tailwind CSS 4 and custom layered CSS
- Node.js serverless handlers
- PostgreSQL
- OpenAI API
- Jest and React Testing Library
- Vercel, Fly.io, and Docker

## Run locally

### Requirements

- Node.js 20 or newer
- npm
- PostgreSQL for persistent referral and dashboard data
- An OpenAI API key for generated interpretations

### Setup

```bash
git clone <repository-url>
cd professional-leverage
npm install
copy .env.example .env
npm start
```

On macOS or Linux, use `cp .env.example .env`. The development client runs at `http://localhost:3000`.

To test the production server locally:

```bash
npm run build
npm run serve
```

The production server defaults to `http://localhost:8080`.

## Environment variables

Copy `.env.example` and provide values only for the services you use.

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Server-side key for interpretation generation |
| `OPENAI_MODEL` | Optional model override |
| `DATABASE_URL` | Preferred PostgreSQL connection string |
| `SITE_URL` | Canonical public origin used in referral links |
| `REFERRER_CODE_SECRET` | Long random secret used to sign referral codes |
| `REFERRAL_GOAL` | Successful referrals required for the unlock |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `ADMIN_SESSION_SECRET` | Random session-signing secret, at least 32 characters |
| `HOST`, `PORT` | Local production server binding |

Never commit `.env`, `.env.admin`, API keys, database credentials, or production admin credentials. These files are ignored by Git.

## Quality checks

```bash
npm run test:ci
npm run build
```

Or run both in sequence:

```bash
npm run check
```

## Security notes

- AI and database credentials remain on the server.
- Admin access fails closed when its credentials or signing secret are absent.
- Admin cookies are signed, expiring, `HttpOnly`, `SameSite=Strict`, and `Secure` in production.
- Result payloads are length-limited and schema-validated before rendering.
- Referral completions use opaque invite tokens and server-side persistence.

For a production deployment, use a managed secret store, rotate secrets periodically, enable PostgreSQL TLS, and place rate limiting in front of public API routes.

## Deployment

- `vercel.json` configures the React build, serverless APIs, and clean route rewrites.
- `Dockerfile`, `server.js`, and `fly.toml` provide a container deployment path.
- `scripts/generate-route-metadata.js` creates route-specific HTML entry points after every production build.

## Key engineering decisions

**Shareable results without a results database.** Scores and structured interpretations are compressed into a versioned, validated URL fragment. Fragments are not sent in HTTP requests, which keeps personalized results out of server logs while allowing a recipient to open the same experience.

**One API surface across deployment targets.** API handlers follow a request/response contract that works as serverless functions and through the custom Node adapter, reducing deployment-specific business logic.

**Progressive referral persistence.** The referral layer uses PostgreSQL when configured and preserves clear configuration checks, allowing the UI to fail with useful states instead of silently claiming success.

## License

This is a proprietary portfolio project. The source is shared for evaluation; no license is granted for commercial reuse.