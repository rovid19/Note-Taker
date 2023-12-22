import globalStore from "../Stores/GlobalStore";
import { projectStore, userProjects } from "../Stores/ProjectStore";
import { putAllFoldersIntoAnArray } from "../Utils/GeneralFunctions";
import Base from "./BaseService";

class ProjectService extends Base {
  constructor() {
    super("http://localhost:3000/api/projects");
  }

  async fetchAllUserProjects(userId: string) {
    projectStore.set("fetchingProjects", true);
    globalStore.set("loaderVisible", true);
    setTimeout(async () => {
      const projects = await this.get("/fetch-user-projects", { userId });
      userProjects.setProjects(projects.folder);
      putAllFoldersIntoAnArray();
      projectStore.set("fetchingProjects", false);
      globalStore.set("loaderVisible", false);
    }, 100);
  }

  async addNewFolder(
    userId: string,
    folderName: string,
    folderId: string,
    folderParentId: string,
    fullDate: string,
    isMainFolder: boolean
  ) {
    await this.post("/create-new-folder", {
      userId,
      folderName,
      folderId,
      folderParentId,
      fullDate,
      isMainFolder,
    });
  }

  async deleteFolder(userId: string, frontendFolderId: string, depth: number) {
    await this.put("/delete-folder", { userId, frontendFolderId, depth });
  }
}

export const projectService = new ProjectService();
