import UserRepo from "@app/repo/UserRepo";
import type { NewUser } from "@app/types";

export class UserService {
  public async createUser(user: NewUser) {
    return UserRepo.create(user);
  }
}

export default new UserService();
