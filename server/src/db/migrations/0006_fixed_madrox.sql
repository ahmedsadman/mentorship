ALTER TABLE "session" RENAME COLUMN "user_id" TO "mentee_id";--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_mentee_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_mentee_id_mentee_id_fk" FOREIGN KEY ("mentee_id") REFERENCES "mentee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
