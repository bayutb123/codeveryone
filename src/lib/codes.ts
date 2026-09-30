import { neon } from "@neondatabase/serverless";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { codes } from "@/db/schema";
import { SAMPLE_CODES } from "./sample-codes";
import type { Category, NewRedeemCode, RedeemCode } from "./types";

export type CodeFilter = {
  query?: string;
  category?: Category;
};

export type CodeStore = {
  list(filter: CodeFilter): Promise<RedeemCode[]>;
  get(id: string): Promise<RedeemCode | undefined>;
  add(input: NewRedeemCode): Promise<RedeemCode>;
};

const LIST_LIMIT = 100;

function toRedeemCode(row: typeof codes.$inferSelect): RedeemCode {
  return {
    ...row,
    howToRedeem: row.howToRedeem ?? undefined,
    expiresAt: row.expiresAt ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

/** Escapes LIKE wildcards so user input is matched literally. */
function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export function createDbStore(db: PgDatabase<PgQueryResultHKT>): CodeStore {
  return {
    async list({ query, category }) {
      const conditions: (SQL | undefined)[] = [];
      if (category) conditions.push(eq(codes.category, category));
      const q = query?.trim();
      if (q) {
        const pattern = `%${escapeLike(q)}%`;
        conditions.push(
          or(
            ilike(codes.platform, pattern),
            ilike(codes.title, pattern),
            ilike(codes.reward, pattern),
          ),
        );
      }
      const rows = await db
        .select()
        .from(codes)
        .where(and(...conditions))
        .orderBy(desc(codes.createdAt))
        .limit(LIST_LIMIT);
      return rows.map(toRedeemCode);
    },

    async get(id) {
      const [row] = await db.select().from(codes).where(eq(codes.id, id));
      return row && toRedeemCode(row);
    },

    async add(input) {
      const [row] = await db
        .insert(codes)
        .values({ ...input, id: crypto.randomUUID() })
        .returning();
      return toRedeemCode(row);
    },
  };
}

export function createMemoryStore(initial: RedeemCode[] = []): CodeStore {
  const items = [...initial];
  return {
    async list({ query, category }) {
      const q = query?.trim().toLowerCase();
      return items
        .filter((c) => !category || c.category === category)
        .filter(
          (c) =>
            !q ||
            [c.platform, c.title, c.reward].some((field) =>
              field.toLowerCase().includes(q),
            ),
        )
        .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, LIST_LIMIT);
    },

    async get(id) {
      return items.find((c) => c.id === id);
    },

    async add(input) {
      const code: RedeemCode = {
        ...input,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      items.push(code);
      return code;
    },
  };
}

let store: CodeStore | undefined;

// Uses Postgres (Neon) when DATABASE_URL is set. Without it, local development
// falls back to an in-memory store with sample codes; production refuses to
// start rather than silently losing submissions.
function getStore(): CodeStore {
  if (store) return store;
  const url = process.env.DATABASE_URL;
  if (url) {
    store = createDbStore(drizzle(neon(url)));
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is not set. Connect a Postgres database.");
  } else {
    console.warn("DATABASE_URL is not set; using in-memory sample codes.");
    store = createMemoryStore(SAMPLE_CODES);
  }
  return store;
}

export function listCodes(filter: CodeFilter = {}) {
  return getStore().list(filter);
}

export function getCode(id: string) {
  return getStore().get(id);
}

export function addCode(input: NewRedeemCode) {
  return getStore().add(input);
}

/** A code stays valid through its whole expiry date (compared in UTC). */
export function isExpired(code: RedeemCode, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  return code.expiresAt !== undefined && code.expiresAt.slice(0, 10) < today;
}
