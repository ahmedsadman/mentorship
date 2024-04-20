import type { user } from "./db/schemas/user";

export type NewUser = typeof user.$inferInsert;
