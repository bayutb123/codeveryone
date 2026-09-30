import type { Category, NewRedeemCode, RedeemCode } from "./types";

// In-memory store for development. Serverless instances on Vercel do not share
// memory, so replace this module with a real database (e.g. Vercel Postgres,
// Neon, Supabase) before relying on user submissions in production.
const store: RedeemCode[] = [
  {
    id: "starfall-launch",
    platform: "Starfall Legends",
    title: "Launch celebration pack",
    code: "SAMPLE-STAR-2026",
    reward: "300 crystals + rare hero ticket",
    category: "game",
    howToRedeem: "Settings → Account → Redeem code",
    expiresAt: "2026-12-31",
    sharedBy: "codeveryone",
    createdAt: "2026-09-20T10:00:00.000Z",
  },
  {
    id: "pixelquest-weekend",
    platform: "PixelQuest",
    title: "Weekend XP boost",
    code: "SAMPLE-PXQ-WKND",
    reward: "2x XP for 48 hours",
    category: "game",
    howToRedeem: "Main menu → Store → Enter code",
    sharedBy: "codeveryone",
    createdAt: "2026-09-25T08:30:00.000Z",
  },
  {
    id: "cloudnote-pro-trial",
    platform: "CloudNote",
    title: "Pro plan trial",
    code: "SAMPLE-CN-PRO30",
    reward: "30 days of CloudNote Pro",
    category: "app",
    howToRedeem: "Billing page → Apply promo code",
    expiresAt: "2026-11-15",
    sharedBy: "codeveryone",
    createdAt: "2026-09-18T14:15:00.000Z",
  },
  {
    id: "streambox-month",
    platform: "StreamBox",
    title: "One free month",
    code: "SAMPLE-SBX-FREE1",
    reward: "1 month of StreamBox Basic",
    category: "service",
    expiresAt: "2026-10-31",
    sharedBy: "codeveryone",
    createdAt: "2026-09-28T19:45:00.000Z",
  },
];

export type CodeFilter = {
  query?: string;
  category?: Category;
};

export async function listCodes({ query, category }: CodeFilter = {}) {
  const q = query?.trim().toLowerCase();
  return store
    .filter((c) => !category || c.category === category)
    .filter(
      (c) =>
        !q ||
        [c.platform, c.title, c.reward].some((field) =>
          field.toLowerCase().includes(q),
        ),
    )
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getCode(id: string) {
  return store.find((c) => c.id === id);
}

export async function addCode(input: NewRedeemCode) {
  const code: RedeemCode = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.push(code);
  return code;
}

/** A code stays valid through its whole expiry date (compared in UTC). */
export function isExpired(code: RedeemCode, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  return code.expiresAt !== undefined && code.expiresAt.slice(0, 10) < today;
}
