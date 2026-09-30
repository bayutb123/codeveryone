# codeveryone

A platform to post and share redeem codes for games, apps, services — anything.

Built with [Next.js](https://nextjs.org) (App Router), TypeScript and Tailwind CSS, ready to deploy on [Vercel](https://vercel.com).

## Features

- Browse shared codes, search by platform/title/reward and filter by category
- Code detail pages with one-click copy, expiry status and redeem instructions
- Share a code through a form backed by a Server Action
- JSON API: `GET /api/codes?q=<search>&category=<game|app|service|other>`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Project structure

```
src/
  app/
    page.tsx              # home: search, filter, code grid
    codes/[id]/page.tsx   # code detail
    share/                # share form + server action
    api/codes/route.ts    # JSON API
  components/             # header, code card, copy button
  lib/
    types.ts              # RedeemCode type and categories
    codes.ts              # data access (in-memory for now)
```

## Data storage

`src/lib/codes.ts` currently keeps codes **in memory** with a few sample entries.
That is fine for local development, but on Vercel each serverless instance has
its own memory and it is reset on every deploy, so shared codes won't persist.
Swap the functions in that file (`listCodes`, `getCode`, `addCode`) for a real
database such as Vercel Postgres / Neon, Supabase or Upstash Redis — the pages
only depend on those functions.

## Deploy on Vercel

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project** and import the repository.
3. Vercel detects Next.js automatically — no extra configuration needed.
4. Add any database environment variables in **Project → Settings → Environment Variables** once storage is wired up.

Or from the CLI: `npx vercel` (preview) and `npx vercel --prod`.
