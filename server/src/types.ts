import type { mentee } from "./db/schemas/mentee";
import type { user } from "./db/schemas/user";

export type NewUser = typeof user.$inferInsert;
export type NewMentee = typeof mentee.$inferInsert;
