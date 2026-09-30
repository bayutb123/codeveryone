import Link from "next/link";

export default function CodeNotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <h1 className="text-2xl font-semibold">Code not found</h1>
      <p className="text-muted-foreground">
        It may have been removed, or the link is wrong.
      </p>
      <Link href="/" className="text-accent underline">
        Browse all codes
      </Link>
    </div>
  );
}
