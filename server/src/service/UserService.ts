import type { NewUser } from "@app/db/types";
import UserRepo from "@app/repo/UserRepo";

class UserService {
  public async createUser(user: NewUser) {
    return UserRepo.create(user);
  }
}

export default new UserService();
