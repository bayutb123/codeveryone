import type { Metadata } from "next";
import { ShareForm } from "./share-form";

export const metadata: Metadata = {
  title: "Share a code",
};

export default function SharePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Share a code</h1>
        <p className="text-muted-foreground">
          Post a redeem code so everyone can use it. Only share codes that are
          meant to be public.
        </p>
      </header>
      <ShareForm />
    </div>
  );
}
