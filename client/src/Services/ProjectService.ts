import { defaultFolder } from "../Stores/ProjectStore";
import { fillSubfolderCounterArray } from "../Utils/GeneralFunctions";
import Base from "./BaseService";

class ProjectService extends Base {
  constructor() {
    super("http://localhost:3000/api/projects");
  }

  async fetchAllUserProjects(userId: string) {
    const userProjects = await this.get("/fetch-user-projects", { userId });
    defaultFolder.setAllFolders(userProjects.folder);
    fillSubfolderCounterArray(userProjects.folder);
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
