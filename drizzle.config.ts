import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Load DATABASE_URL from .env.local etc., the same way Next.js does.
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
