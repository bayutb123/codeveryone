"use client";

import { useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked; the code stays visible to copy by hand.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
