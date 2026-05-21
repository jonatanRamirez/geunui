
# McD Muse Mobile (Vercel-ready)

A mobile-native style web application (Next.js App Router + Tailwind) with:
- **Settings page**: language (EN/ES), loyalty points, widget count, geo capture, prompt template, **selector JSON input**, and optional API base URL.
- **Home page**: prompt input → server route → **Shopping Muse Assistant API** → renders widgets.

## Setup

1) Install
```bash
npm install
```

2) Configure env vars (server-side only)
Create `.env.local`:
```bash
DY_API_KEY=your-api-key
DY_API_BASE_URL=https://dy-api.com
```

3) Run
```bash
npm run dev
```

## Deploy to Vercel
- Import repo into Vercel
- Add environment variables (`DY_API_KEY`, optionally `DY_API_BASE_URL`)
- Deploy

## Notes
- The Shopping Muse API requires a `selector` object; this app lets you provide it as JSON in Settings.
- chat continuity uses `chatId` stored in `localStorage`.
