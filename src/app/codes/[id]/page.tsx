import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { getCode, isExpired } from "@/lib/codes";

export async function generateMetadata({
  params,
}: PageProps<"/codes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const code = await getCode(id);
  if (!code) return {};
  return {
    title: `${code.platform}: ${code.title}`,
    description: `${code.reward} — redeem code for ${code.platform}`,
  };
}

export default async function CodePage({ params }: PageProps<"/codes/[id]">) {
  const { id } = await params;
  const code = await getCode(id);
  if (!code) notFound();

  const expired = isExpired(code);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← All codes
      </Link>

      <header className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {code.platform} · <span className="capitalize">{code.category}</span>
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">{code.title}</h1>
        <p className="text-muted-foreground">{code.reward}</p>
      </header>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
        <code
          className={`break-all font-mono text-xl ${expired ? "line-through opacity-60" : ""}`}
        >
          {code.code}
        </code>
        <CopyButton value={code.code} />
      </div>

      <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-sm">
        <dt className="text-muted-foreground">Status</dt>
        <dd>{expired ? "Expired" : "Active"}</dd>
        <dt className="text-muted-foreground">Expires</dt>
        <dd>{code.expiresAt ?? "No known expiry"}</dd>
        {code.howToRedeem && (
          <>
            <dt className="text-muted-foreground">How to redeem</dt>
            <dd>{code.howToRedeem}</dd>
          </>
        )}
        <dt className="text-muted-foreground">Shared by</dt>
        <dd>{code.sharedBy}</dd>
        <dt className="text-muted-foreground">Posted</dt>
        <dd>{new Date(code.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}</dd>
      </dl>
    </div>
  );
}
