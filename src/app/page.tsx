import Link from "next/link";
import { CodeCard } from "@/components/code-card";
import { listCodes } from "@/lib/codes";
import { CATEGORIES, type Category } from "@/lib/types";

function parseCategory(value: unknown): Category | undefined {
  return CATEGORIES.find((c) => c === value);
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : undefined;
  const category = parseCategory(params.category);
  const codes = await listCodes({ query, category });

  const categoryHref = (c?: Category) => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (c) next.set("category", c);
    const qs = next.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Redeem codes, for everyone.
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Discover and share redeem codes for games, apps and services. Found a
          code? Post it so others can grab it too.
        </p>
      </section>

      <form action="/" className="flex gap-2">
        {category && <input type="hidden" name="category" value={category} />}
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search by platform, title or reward…"
          className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Search
        </button>
      </form>

      <nav className="flex flex-wrap gap-2 text-sm">
        {[undefined, ...CATEGORIES].map((c) => {
          const active = c === category;
          return (
            <Link
              key={c ?? "all"}
              href={categoryHref(c)}
              className={`rounded-full border px-3 py-1 capitalize ${
                active
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border hover:bg-muted"
              }`}
            >
              {c ?? "All"}
            </Link>
          );
        })}
      </nav>

      {codes.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {codes.map((code) => (
            <CodeCard key={code.id} code={code} />
          ))}
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No codes found.{" "}
          <Link href="/share" className="text-accent underline">
            Share one
          </Link>
          ?
        </p>
      )}
    </div>
  );
}
