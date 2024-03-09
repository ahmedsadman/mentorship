CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"email" varchar(256) NOT NULL,
	"password" varchar(256),
	"is_admin" boolean DEFAULT false,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
