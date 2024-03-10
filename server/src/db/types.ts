import type { user } from "./schemas/user";

export type NewUser = typeof user.$inferInsert;
export type QueryUser = typeof user.$inferSelect;
