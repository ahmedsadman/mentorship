import sessionRepo from "@app/repo/SessionRepo";
import type { NewSession } from "@app/types";

class SessionService {
  public async createSession(session: NewSession) {
    return sessionRepo.create(session);
  }
}

export default new SessionService();
