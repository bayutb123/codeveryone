// Applies pending migrations from ./drizzle to DATABASE_URL.
// Uses Neon's HTTP driver (like the app), so it works in Vercel builds.
import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

nextEnv.loadEnvConfig(process.cwd());

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set; cannot run migrations.");
  process.exit(1);
}

await migrate(drizzle(neon(url)), { migrationsFolder: "drizzle" });
console.log("Migrations are up to date.");
