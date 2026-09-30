"use client";

import { useActionState } from "react";
import { CATEGORIES } from "@/lib/types";
import { shareCode, type ShareState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">
        {label}
        {hint && <span className="font-normal text-muted-foreground"> — {hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function ShareForm() {
  const [state, action, pending] = useActionState<ShareState, FormData>(
    shareCode,
    {},
  );
  const v = state.values ?? {};

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Platform" hint="game, app or service">
          <input name="platform" required defaultValue={v.platform} className={inputClass} />
        </Field>
        <Field label="Category">
          <select name="category" defaultValue={v.category ?? "game"} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c[0].toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Title">
        <input name="title" required defaultValue={v.title} className={inputClass} />
      </Field>
      <Field label="Code">
        <input
          name="code"
          required
          autoComplete="off"
          defaultValue={v.code}
          className={`${inputClass} font-mono`}
        />
      </Field>
      <Field label="Reward" hint="what the code gives">
        <input name="reward" required defaultValue={v.reward} className={inputClass} />
      </Field>
      <Field label="How to redeem" hint="optional">
        <input name="howToRedeem" defaultValue={v.howToRedeem} className={inputClass} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Expires" hint="optional">
          <input type="date" name="expiresAt" defaultValue={v.expiresAt} className={inputClass} />
        </Field>
        <Field label="Your name" hint="optional">
          <input name="sharedBy" defaultValue={v.sharedBy} className={inputClass} />
        </Field>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Sharing…" : "Share code"}
      </button>
    </form>
  );
}
