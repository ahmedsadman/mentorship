import { boolean, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 256 }),
	email: varchar("email", { length: 256 }).notNull().unique(),
	password: varchar("password", { length: 256 }),
	isAdmin: boolean("is_admin").default(false),
});
