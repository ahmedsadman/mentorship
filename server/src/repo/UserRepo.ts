import { db } from "../db";
import { user as userTable } from "../db/schemas/user";
import type { NewUser } from "../types";

class UserRepo {
  public async create(user: NewUser) {
    const { id, name, email, createdAt } = userTable;
    const result = await db
      .insert(userTable)
      .values(user)
      .returning({ id, name, email, createdAt });
    return result[0];
  }
}

export default new UserRepo();
