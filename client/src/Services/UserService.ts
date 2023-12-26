import Base from "./BaseService";
import { defaultUser, userStore } from "../Stores/UserStore";
import { redirectAfterLogin } from "../Components/UserAuth/UserAuthLogic";
import { todoService } from "./TodoService";

class UserService extends Base {
  constructor() {
    super(`https://note-editor-client.up.railway.app/api/user`);
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
    redirectAfterLogin();
  }

  async logoutUser() {
    await this.post("/logout-user", {});
    userStore.set("isUserLoggedIn", false);
  }

  async getUser() {
    const user = await this.get("/get-user", {});
    if (user) {
      defaultUser.setUser(user.email, user.username, "", "", user._id);
      userStore.set("isUserLoggedIn", true);
      await todoService.fetchTodo(user._id);
    }
  }
}

export const userApiRequest = new UserService();
