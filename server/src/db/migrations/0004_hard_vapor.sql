ALTER TYPE "status" ADD VALUE 'accepted';--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "length" integer;