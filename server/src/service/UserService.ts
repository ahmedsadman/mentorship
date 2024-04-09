import type { NewUser } from "../db/types";
import UserRepo from "../repo/UserRepo";

class UserService {
  public static async create(user: NewUser) {
    return UserRepo.create(user);
  }
}

export default UserService;
