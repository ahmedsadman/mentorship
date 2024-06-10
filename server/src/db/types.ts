import type { user } from "./schemas/user";

// TODO: Need to unify all these types under the single root types.ts file
export type NewUser = typeof user.$inferInsert;
export type QueryUser = typeof user.$inferSelect;
