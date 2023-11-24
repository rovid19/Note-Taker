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
  constructor(
    public folderName: string = "",
    public folderId: string = "",
    public folderParentId: string = "",
    public folderDepth: number = 0,
    public folderContent: FolderInterface[] = []
  ) {}

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
  constructor(public projects: FolderInterface[] = []) {}

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
  deleteFolder(
    folderContent: FolderInterface[],
    id: string,
    folder: FolderInterface
  ) {
    if (folderContent.length > 0) {
      let newContentArray = folderContent.filter((folder) => folder._id !== id);
      folder.contet = newContentArray;
    } else {
      console.log(this.projects, id);
      const newProjectArray = this.projects.filter(
        (folder) => folder._id !== id
      );
      console.log(newProjectArray);
      this.projects = newProjectArray;
    }
  }

  /*setNewFolderTitle(id: string, newFolderName: string) {
  defaultFolder.selectedFolder(newFolderName, "",[])
  }*/
}

export const defaultFolder = new Folder();
export const userProjects = new UserProjects();
export const projectStore = new ProjectStore();
