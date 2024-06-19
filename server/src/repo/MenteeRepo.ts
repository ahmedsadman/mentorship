import { db } from "@app/db";
import { mentee as menteeTable } from "@app/db/schemas/mentee";
import { user as userTable } from "@app/db/schemas/user";
import type { NewMentee } from "@app/types";
import { eq } from "drizzle-orm";

class MenteeRepo {
  public async create(mentee: NewMentee) {
    const { id, plan, price, active } = menteeTable;
    const result = await db
      .insert(menteeTable)
      .values(mentee)
      .returning({ id, plan, price, active });
    return result[0];
  }

  public async getByEmail(email: string) {
    const result = await db
      .select()
      .from(userTable)
      .leftJoin(menteeTable, eq(userTable.id, menteeTable.userId))
      .where(eq(userTable.email, email));
    return result[0];
  }
}

export default new MenteeRepo();
