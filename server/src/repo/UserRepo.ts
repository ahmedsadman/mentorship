import { db } from "@app/db";
import { user as userTable } from "@app/db/schemas/user";
import type { NewUser } from "@app/types";

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
