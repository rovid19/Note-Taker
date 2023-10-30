import Base from "./BaseService";
import { defaultUser } from "../Stores/UserStore";

class UserService extends Base {
  constructor() {
    super("http://localhost:3000/api/user");
  }

  async registerUser(email: string, username: string, password: string) {
    const user = await this.post("/register-user", {
      email,
      username,
      password,
    });
    console.log(user);
  }

  async loginUser(email: string, password: string) {
    const user = await this.post("/login-user", { email, password });
    console.log(user);
  }
}

export const userApiRequest = new UserService();
