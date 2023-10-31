import Base from "./BaseService";
import { defaultUser, userStore } from "../Stores/UserStore";
import { redirectAfterLogin } from "../Components/UserAuth/UserAuthLogic";

class UserService extends Base {
  constructor() {
    super("http://localhost:3000/api/user");
  }

  async registerUser(email: string, username: string, password: string) {
    await this.post("/register-user", {
      email,
      username,
      password,
    });
    await this.loginUser(email, password);
  }

  async loginUser(email: string, password: string) {
    const user = await this.post("/login-user", { email, password });
    defaultUser.setUser(user.email, user.username, "", "", user._id);
    console.log(defaultUser);
    redirectAfterLogin();
  }

  async logoutUser() {
    await this.post("/logout-user", {});
    userStore.set("isUserLoggedIn", false);
  }

  async getUser() {
    const user = await this.get("/get-user", {});
    console.log(user);
  }
}

export const userApiRequest = new UserService();