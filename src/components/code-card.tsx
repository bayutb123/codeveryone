import Link from "next/link";
import { isExpired } from "@/lib/codes";
import type { RedeemCode } from "@/lib/types";
import { CopyButton } from "./copy-button";

export function CodeCard({ code }: { code: RedeemCode }) {
  const expired = isExpired(code);

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-medium uppercase tracking-wide text-muted-foreground">
          {code.platform}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 capitalize text-muted-foreground">
          {code.category}
        </span>
      </div>
      <Link href={`/codes/${code.id}`} className="hover:underline">
        <h2 className="font-semibold">{code.title}</h2>
      </Link>
      <p className="text-sm text-muted-foreground">{code.reward}</p>
      <div className="mt-auto flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2">
        <code
          className={`truncate font-mono text-sm ${expired ? "line-through opacity-60" : ""}`}
        >
          {code.code}
        </code>
        <CopyButton value={code.code} />
      </div>
      <p className="text-xs text-muted-foreground">
        {expired
          ? "Expired"
          : code.expiresAt
            ? `Expires ${code.expiresAt}`
            : "No known expiry"}
      </p>
    </article>
  );
}
