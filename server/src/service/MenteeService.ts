import type { QueryUser } from "@app/db/types";
import menteeRepo from "@app/repo/MenteeRepo";
import type { NewMentee, NewSession, NewUser, QueryMentee } from "@app/types";
import sessionService from "./SessionService";
import { UserService } from "./UserService";

type MenteeUser = NewUser & NewMentee;
export type MenteeCreateResponse = {
  // TODO: Fetch public fields from class
  user: Pick<QueryUser, "id" | "name" | "email" | "createdAt">;
  mentee: Pick<QueryMentee, "id" | "plan" | "price" | "active">;
};

class MenteeService extends UserService {
  public async createMentee(menteeUser: MenteeUser) {
    const { name, email, password, plan, price } = menteeUser;
    const dbUser = await this.createUser({ name, email, password });
    const dbMentee = await menteeRepo.create({
      plan,
      price,
      userId: dbUser.id,
    });

    return {
      user: dbUser,
      mentee: dbMentee,
    };
  }

  public async createSession(session: NewSession) {
    return sessionService.createSession(session);
  }
}

export default new MenteeService();
