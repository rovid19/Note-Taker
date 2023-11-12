import { defaultFolder } from "../Stores/ProjectStore";
import Base from "./BaseService";

class ProjectService extends Base {
  constructor() {
    super("http://localhost:3000/api/projects");
  }

  async fetchAllUserProjects(userId: string) {
    const userProjects = await this.get("/fetch-user-projects", { userId });
    defaultFolder.setAllFolders(userProjects.folder);
  }
}

export const projectService = new ProjectService();
