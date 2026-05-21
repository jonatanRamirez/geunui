
# geunui — McD Muse V3 (agent-assistant)

Mobile-native style Next.js app that proxies requests to Dynamic Yield Shopping Muse V3 endpoint.

## Setup

```bash
npm install
cp .env.example .env.local
# set DY_API_KEY
npm run dev
```

## Deploy (Vercel)
- Import repo
- Set `DY_API_KEY` and optionally `DY_API_BASE_URL`

## Notes
- The app calls `/api/muse` from the browser to keep API keys server-side.
- The server route calls `.../v2/serve/user/agent-assistant`.
- DYID/session continuity is handled via cookies (`_dyid`, `_dyid_server`, `_dyjsession`) when present.
- The request payload is logged in the serverless function logs for debugging.
