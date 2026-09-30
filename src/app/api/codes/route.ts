import { listCodes } from "@/lib/codes";
import { CATEGORIES } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = CATEGORIES.find((c) => c === searchParams.get("category"));
  const codes = await listCodes({
    query: searchParams.get("q") ?? undefined,
    category,
  });
  return Response.json({ codes });
}
