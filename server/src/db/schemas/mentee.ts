import { boolean, integer, pgEnum, pgTable, serial } from "drizzle-orm/pg-core";
import { user } from "./user";

export const planEnum = pgEnum("plan", ["lite", "standard", "pro"]);

export const mentee = pgTable("mentee", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => user.id),
  active: boolean("active").default(true),
  plan: planEnum("plan"),
  price: integer("price"),
});
