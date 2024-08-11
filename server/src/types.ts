import type { mentee } from "./db/schemas/mentee";
import type { session } from "./db/schemas/session";
import type { user } from "./db/schemas/user";

export type NewUser = typeof user.$inferInsert;
export type NewMentee = typeof mentee.$inferInsert;
export type NewSession = typeof session.$inferInsert;
export type QueryMentee = typeof mentee.$inferSelect;

export enum WebhookTrigger {
  BOOKING_CREATED = "BOOKING_CREATED",
  BOOKING_CANCELLED = "BOOKING_CANCELLED",
}
