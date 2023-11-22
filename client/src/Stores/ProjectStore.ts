import { FolderInterface } from "../Components/Sidebar/SidebarLogic";
import { loopThroughArrayReturnFoundFolderAndPushNewFolderInside } from "../Utils/GeneralFunctions";

interface InitialState {
  isCreateNewFolderVisible: boolean;
  newFolderTitle: string;
  subFolderVisible: boolean;
  [key: string]: any;
  createNewFolder: boolean;
}

type Listener = (key: any, value: any) => void;

const initialState = {
  isCreateNewFolderVisible: false,
  newFolderTitle: "",
  subFolderVisible: false,
  selectedFolder: false,
  createNewFolder: false,
};

class ProjectStore {
  state: InitialState;
  listeners: { [key: string]: Listener[] };

  constructor(newStore: InitialState = initialState) {
    this.state = { ...newStore };
    this.listeners = {};
  }

  get(key: string): string | undefined | number | boolean {
    return this.state[key];
  }

  set(key: string, value: string | number | boolean | null | Element): void {
    if (this.state[key] !== value) {
      this.state[key] = value;
      this.notify(key, value);
    }
  }

  notify(key: string, value: string | number | boolean | null | Element): void {
    if (this.listeners[key]) {
      this.listeners[key].forEach((listener) => listener(key, value));
    }
  }

  subscribe(key: string, func: Listener) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }

    this.listeners[key].push(func);
  }
}

class Folder {
  folderName;
  folderId;
  folderParentId;
  folderDepth;
  folderContent;
  constructor(
    folderName: string = "",
    folderId: string = "",
    folderParentId: string = "",
    folderDepth: number = 0,
    folderContent: FolderInterface[] = []
  ) {
    (this.folderName = folderName),
      (this.folderId = folderId),
      (this.folderParentId = folderParentId),
      (this.folderDepth = folderDepth),
      (this.folderContent = folderContent);
  }

  selectedFolder(
    folderName: string,
    folderId: string,
    folderParentId: string,
    folderDepth: number,
    folderContent: FolderInterface[]
  ) {
    (this.folderName = folderName),
      (this.folderId = folderId),
      (this.folderParentId = folderParentId),
      (this.folderDepth = folderDepth),
      (this.folderContent = folderContent);
  }
  setFolderId(id: string) {
    this.folderId = id;
  }
  setNewFolderTitle(title: string) {
    this.folderName = title;
  }
}

class UserProjects {
  projects: FolderInterface[];
  constructor(projects: FolderInterface[] = []) {
    this.projects = projects;
  }

  setProjects(projects: FolderInterface[]) {
    this.projects = projects;
  }

  addNewFolder(folder: FolderInterface, parentId: string, purpose: string) {
    if (purpose === "add") {
      if (parentId.length > 0) {
        loopThroughArrayReturnFoundFolderAndPushNewFolderInside(
          this.projects,
          parentId,
          folder
        );
      } else {
        this.projects.push(folder);
      }
    } else {
      const newFolder = {
        name: folder.folderName,
        dateCreated: folder.dateCreated,
        id: folder.folderId,
        parentId: folder.parentId,
        content: [],
      };
      if (parentId.length > 0) {
        loopThroughArrayReturnFoundFolderAndPushNewFolderInside(
          this.projects,
          parentId,
          folder
        );
      } else {
        this.projects.push(newFolder);
      }
    }
  }
  removeFolderFromProjects(id: string) {
    console.log(this.projects);
    const newArray = this.projects.filter((folder) => !folder.new);
    console.log(newArray);
    this.projects = newArray;
  }

  /*setNewFolderTitle(id: string, newFolderName: string) {
  defaultFolder.selectedFolder(newFolderName, "",[])
  }*/
}

export const defaultFolder = new Folder();
export const userProjects = new UserProjects();
export const projectStore = new ProjectStore();
