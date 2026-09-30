CREATE TYPE "public"."category" AS ENUM('game', 'app', 'service', 'other');--> statement-breakpoint
CREATE TABLE "codes" (
	"id" text PRIMARY KEY NOT NULL,
	"platform" text NOT NULL,
	"title" text NOT NULL,
	"code" text NOT NULL,
	"reward" text NOT NULL,
	"category" "category" NOT NULL,
	"how_to_redeem" text,
	"expires_at" date,
	"shared_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "codes_created_at_idx" ON "codes" USING btree ("created_at");