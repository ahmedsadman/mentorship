import { db } from "@app/db";
import { session as sessionTable } from "@app/db/schemas/session";
import type { NewSession } from "@app/types";

class SessionRepo {
  public async create(session: NewSession) {
    const { id, menteeId, startTime, endTime, status } = sessionTable;
    const result = await db
      .insert(sessionTable)
      .values(session)
      .returning({ id, menteeId, startTime, endTime, status });
    return result[0];
  }
}

export default new SessionRepo();
