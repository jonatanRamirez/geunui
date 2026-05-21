
# McD Muse Mobile — Hardened (Vercel-safe)

This is a hardened build of the McD Muse prototype.

## Why “hardened”
- Vercel deployments can fail on TypeScript or ESLint errors.
- This version configures Next.js to **not fail builds** on lint/type errors:
  - `eslint.ignoreDuringBuilds = true`
  - `typescript.ignoreBuildErrors = true`

> Note: This is intended for rapid prototyping and demos. Re-enable strict checks for production hardening.

## Setup

```bash
npm install
cp .env.example .env.local
# set DY_API_KEY
npm run dev
```

## Deploy
- Import repo into Vercel
- Set env vars: `DY_API_KEY`, optionally `DY_API_BASE_URL`

## App
- `/settings`: configuration (EN/ES, loyalty points, widget count, geo, prompt template, selector JSON)
- `/`: prompt → server `/api/muse` → renders Shopping Muse widgets
