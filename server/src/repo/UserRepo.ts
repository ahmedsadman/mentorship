import { db } from "../db";
import { user as userTable } from "../db/schemas/user";

// TODO: Move to common place
type NewUser = typeof userTable.$inferInsert;

class UserRepo {
	public static async create(user: NewUser) {
		const { id, name, email, createdAt } = userTable;
		const result = await db
			.insert(userTable)
			.values(user)
			.returning({ id, name, email, createdAt });
		return result[0];
	}
}

export default UserRepo;
