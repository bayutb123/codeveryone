export const CATEGORIES = ["game", "app", "service", "other"] as const;

export type Category = (typeof CATEGORIES)[number];

export type RedeemCode = {
  id: string;
  /** The game, app or service the code is redeemed on. */
  platform: string;
  title: string;
  code: string;
  /** What the code gives, e.g. "500 gems". */
  reward: string;
  category: Category;
  /** How to redeem, e.g. a URL or in-app menu path. */
  howToRedeem?: string;
  /** ISO date string. Absent means no known expiry. */
  expiresAt?: string;
  sharedBy: string;
  createdAt: string;
};

export type NewRedeemCode = Omit<RedeemCode, "id" | "createdAt">;
