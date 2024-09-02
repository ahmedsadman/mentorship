import type { mentee } from "./db/schemas/mentee";
import type { session } from "./db/schemas/session";
import type { user } from "./db/schemas/user";

export type NewUser = typeof user.$inferInsert;
export type NewMentee = typeof mentee.$inferInsert;
export type NewSession = typeof session.$inferInsert;
export type QuerySession = typeof session.$inferSelect;
export type QueryMentee = typeof mentee.$inferSelect;
export type QueryUser = typeof user.$inferSelect;

export enum WebhookTrigger {
  BOOKING_CREATED = "BOOKING_CREATED",
  BOOKING_CANCELLED = "BOOKING_CANCELLED",
}

type Attendee = {
  email: string;
  name: string;
  timezone: string;
  utcOffset: number;
};

export type WebhookPayload = {
  triggerEvent: string;
  createdAt: string;
  payload: {
    attendees: Attendee[];
    startTime: string;
    endTime: string;
    length: number;
    bookingId: number | null;
  };
};
