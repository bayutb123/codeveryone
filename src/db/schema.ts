import { date, index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { CATEGORIES } from "@/lib/types";

export const categoryEnum = pgEnum("category", CATEGORIES);

export const codes = pgTable(
  "codes",
  {
    id: text("id").primaryKey(),
    platform: text("platform").notNull(),
    title: text("title").notNull(),
    code: text("code").notNull(),
    reward: text("reward").notNull(),
    category: categoryEnum("category").notNull(),
    howToRedeem: text("how_to_redeem"),
    expiresAt: date("expires_at", { mode: "string" }),
    sharedBy: text("shared_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("codes_created_at_idx").on(t.createdAt)],
);
