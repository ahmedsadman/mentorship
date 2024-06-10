import { db } from "@app/db";
import { session as sessionTable } from "@app/db/schemas/session";
import type { NewSession } from "@app/types";
import { eq } from "drizzle-orm";

class SessionRepo {
  public async create(session: NewSession) {
    const { id, menteeId, startTime, endTime, status } = sessionTable;
    const result = await db
      .insert(sessionTable)
      .values(session)
      .returning({ id, menteeId, startTime, endTime, status });
    return result[0];
  }

  public async getMenteeSessions(_menteeId: number) {
    // TODO: Extract the public fields as class attribute
    const { id, menteeId, startTime, endTime, status } = sessionTable;
    const result = await db
      .select({ id, menteeId, startTime, endTime, status })
      .from(sessionTable)
      .where(eq(sessionTable.menteeId, _menteeId));
    return result;
  }
}

export default new SessionRepo();
