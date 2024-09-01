import { db } from "@app/db";
import { session as sessionTable } from "@app/db/schemas/session";
import type { NewSession } from "@app/types";
import { and, eq, gte, lte } from "drizzle-orm";

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

  public async getMenteeSessions(
    _menteeId?: number | undefined,
    _startDate?: string | undefined,
    _endDate?: string | undefined,
  ) {
    const { id, bookingId, menteeId, startTime, endTime, length, status } =
      sessionTable;
    const whereClauses = [];

    if (_menteeId) {
      whereClauses.push(eq(sessionTable.menteeId, _menteeId));
    }

    if (_startDate) {
      whereClauses.push(gte(sessionTable.startTime, new Date(_startDate)));
    }

    if (_endDate) {
      whereClauses.push(
        lte(sessionTable.startTime, new Date(`${_endDate}T23:59:59`)),
      );
    }

    const result = await db
      .select({ id, menteeId, bookingId, startTime, endTime, length, status })
      .from(sessionTable)
      .where(and(...whereClauses));
    return result;
  }
}

export default new SessionRepo();
