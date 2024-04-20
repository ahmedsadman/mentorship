import { db } from "@app/db";
import { mentee as menteeTable } from "@app/db/schemas/mentee";
import type { NewMentee } from "@app/types";

class MenteeRepo {
  public async create(mentee: NewMentee) {
    const { id, plan, price, active } = menteeTable;
    const result = await db
      .insert(menteeTable)
      .values(mentee)
      .returning({ id, plan, price, active });
    return result[0];
  }
}

export default new MenteeRepo();
