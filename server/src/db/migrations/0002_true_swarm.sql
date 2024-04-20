DO $$ BEGIN
 CREATE TYPE "plan" AS ENUM('lite', 'standard', 'pro');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentee" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"active" boolean DEFAULT true,
	"plan" "plan",
	"price" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentee" ADD CONSTRAINT "mentee_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
