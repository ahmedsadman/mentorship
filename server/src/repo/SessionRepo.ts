import { db } from "@app/db";
import { session as sessionTable } from "@app/db/schemas/session";
import type { NewSession } from "@app/types";
import { eq } from "drizzle-orm";

class SessionRepo {
  public async create(session: NewSession) {
    const { id, bookingId, menteeId, startTime, endTime, length, status } =
      sessionTable;
    const result = await db.insert(sessionTable).values(session).returning({
      id,
      bookingId,
      menteeId,
      startTime,
      endTime,
      length,
      status,
    });
    return result[0];
  }

  public async updateSession(bookingId: number, updatedFields: object) {
    const updatedSession = await db
      .update(sessionTable)
      .set(updatedFields)
      .where(eq(sessionTable.bookingId, bookingId))
      .returning({
        id: sessionTable.id,
        bookingId: sessionTable.bookingId,
        status: sessionTable.status,
      });
    return updatedSession[0];
  }

  public async getMenteeSessions(_menteeId: number) {
    // TODO: Extract the public fields as class attribute
    const { id, bookingId, menteeId, startTime, endTime, length, status } =
      sessionTable;
    const result = await db
      .select({ id, menteeId, bookingId, startTime, endTime, length, status })
      .from(sessionTable)
      .where(eq(sessionTable.menteeId, _menteeId));
    return result;
  }
}

export default new SessionRepo();
