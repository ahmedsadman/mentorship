import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { mentee } from "./mentee";

export const statusEnum = pgEnum("status", ["pending", "cancelled", "done"]);

export const session = pgTable("session", {
  id: serial("id").primaryKey(),
  menteeId: integer("user_id").references(() => mentee.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: statusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
