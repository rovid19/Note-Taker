import { isSidebarVisible } from "../Components/Sidebar/SidebarLogic";
import { mapOverTodoItems } from "../Components/TodoList/TodoListLogic";
import globalStore from "../Stores/GlobalStore";
import { projectStore, userProjects } from "../Stores/ProjectStore";
import { todoList } from "../Stores/TodoStore";
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
      todoList.setTodo(projects.todoList);
      projectStore.set("fetchingProjects", false);
      globalStore.set("loaderVisible", false);
      const todoVisible = globalStore.get("todoListVisible");
      if (todoVisible) {
        mapOverTodoItems();
      }
      document.getElementById("sidebar-container")?.remove();
      isSidebarVisible();
    }, 0);
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
