import { userProjects } from "../Stores/ProjectStore";
import Base from "./BaseService";

class ProjectService extends Base {
  constructor() {
    super("http://localhost:3000/api/projects");
  }

  async fetchAllUserProjects(userId: string) {
    const projects = await this.get("/fetch-user-projects", { userId });
    userProjects.setProjects(projects.folder);
  }

  async addNewFolder(
    userId: string,
    folderName: string,
    folderId: string,
    fullDate: string
  ) {
    await this.post("/create-new-folder", {
      userId,
      folderName,
      folderId,
      fullDate,
    });
  }
}

export const projectService = new ProjectService();
