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
    codes.ts              # data access (Postgres, or in-memory in dev)
    sample-codes.ts       # sample data for the in-memory store
  db/
    schema.ts             # Drizzle table definitions
drizzle/                  # generated SQL migrations
scripts/migrate.mjs       # applies migrations (locally and in Vercel builds)
vercel.json               # runs migrations before each Vercel build
```

## Database

Codes are stored in Postgres ([Neon](https://neon.tech), serverless driver)
through [Drizzle ORM](https://orm.drizzle.team). The schema lives in
`src/db/schema.ts` and SQL migrations in `drizzle/`.

When `DATABASE_URL` is **not** set, local development falls back to an
in-memory store with a few sample codes, so you can work on the UI without a
database. In production a missing `DATABASE_URL` is an error.

### Connect a database

1. In your Vercel project, open **Storage → Create Database → Neon (Postgres)**
   and connect it to the project. This sets `DATABASE_URL` for every
   environment.
2. Pull the variables locally: `npx vercel link && npx vercel env pull .env.local`
   (or copy `.env.example` to `.env.local` and paste a connection string).
3. Create the tables: `npm run db:migrate`.

Every Vercel deployment runs `npm run db:migrate` before `next build`
(see `vercel.json`), so production and preview databases — including Neon's
per-preview branches — always have the latest schema. Already-applied
migrations are skipped, and a failed migration fails the deployment instead of
shipping code that expects tables that don't exist.

### Changing the schema

1. Edit `src/db/schema.ts`.
2. `npm run db:generate` to write a new migration to `drizzle/`, and commit it.
3. `npm run db:migrate` to apply it locally. Vercel deployments apply it
   automatically.

`npm run db:studio` opens Drizzle Studio to browse the data.

## Deploy on Vercel

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project** and import the repository.
3. Vercel detects Next.js automatically — no extra configuration needed.
4. Connect a Neon database and run the migrations — see [Connect a database](#connect-a-database).

Or from the CLI: `npx vercel` (preview) and `npx vercel --prod`.
