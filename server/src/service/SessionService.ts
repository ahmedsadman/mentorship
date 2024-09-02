import menteeRepo from "@app/repo/MenteeRepo";
import sessionRepo from "@app/repo/SessionRepo";
import type { NewSession, QuerySession } from "@app/types";
import { convertTimzeone } from "@app/utils";

export type SearchPayload = {
  email: string;
  startDate?: string | undefined;
  endDate?: string | undefined;
};

type FormattedSession = Omit<
  QuerySession,
  "createdAt" | "updatedAt" | "startTime" | "endTime"
> & {
  startTime: string;
  endTime: string;
};

class SessionService {
  public async createSession(session: NewSession) {
    return sessionRepo.create(session);
  }

  public async updateSession(bookingId: number, updatedFields: object) {
    return sessionRepo.updateSession(bookingId, updatedFields);
  }

  public async getMenteeSessions(
    menteeId: number,
    startDate?: string,
    endDate?: string,
  ) {
    return sessionRepo.getMenteeSessions(menteeId, startDate, endDate);
  }

  private formatSessions(
    sessions: Omit<QuerySession, "createdAt" | "updatedAt">[],
  ) {
    const zone = "Asia/Dhaka";
    const formattedSessions: FormattedSession[] = [];

    for (const session of sessions) {
      const { startTime, endTime, ...rest } = session;
      const formattedSession: FormattedSession = {
        startTime: convertTimzeone(startTime, zone),
        endTime: convertTimzeone(endTime, zone),
        ...rest,
      };
      formattedSessions.push(formattedSession);
    }
    return formattedSessions;
  }

  public async searchSession(payload: SearchPayload) {
    const { email, startDate, endDate } = payload;
    const mentee = await menteeRepo.getByEmail(email);
    if (!mentee.mentee) {
      throw new Error("Mentee with given email not found");
    }

    const sessions = await this.getMenteeSessions(
      mentee.mentee.id,
      startDate,
      endDate,
    );
    const formattedSessions: FormattedSession[] = this.formatSessions(sessions);

    return {
      mentee: mentee.mentee,
      sessionCount: sessions.length,
      sessions: formattedSessions,
    };
  }
}

export default new SessionService();
