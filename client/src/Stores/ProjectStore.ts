import { FolderInterface } from "../Components/Sidebar/SidebarLogic";
import {
  loopThroughArrayAndSaveNewFolder,
  loopThroughArrayReturnFoundFolderAndPushNewFolderInside,
} from "../Utils/GeneralFunctions";

interface InitialState {
  isCreateNewFolderVisible: boolean;
  newFolderTitle: string;
  rightClickVisible: boolean;
  [key: string]: any;
  createNewFolder: boolean;
  subfolderVisible: boolean;
  selectedFolderElement: HTMLElement;
  createMainFolder: boolean;
}

type Listener = (key: any, value: any) => void;

const initialState = {
  isCreateNewFolderVisible: false,
  newFolderTitle: "",
  rightClickVisible: false,
  selectedFolder: false,
  createNewFolder: false,
  subfolderVisible: false,
  selectedFolderElement: <HTMLElement>{},
  createMainFolder: false,
};

class ProjectStore {
  state: InitialState;
  listeners: { [key: string]: Listener[] };

  constructor(newStore: InitialState = initialState) {
    this.state = { ...newStore };
    this.listeners = {};
  }

  get(key: string): string | undefined | number | boolean | HTMLElement {
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
    public folderFrontendId: string = "",
    public folderDepth: number = 0,
    public folderContent: FolderInterface[] = []
  ) {}

  selectedFolder(
    folderName: string,
    folderId: string,
    folderParentId: string,
    folderFrontendId: string,
    folderDepth: number,
    folderContent: FolderInterface[]
  ) {
    (this.folderName = folderName),
      (this.folderId = folderId),
      (this.folderParentId = folderParentId),
      (this.folderFrontendId = folderFrontendId),
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

  addNewFolder(folder: FolderInterface, parentId: string) {
    console.log(parentId, folder);
    if (parentId.length > 0) {
      loopThroughArrayReturnFoundFolderAndPushNewFolderInside(
        this.projects,
        parentId,
        folder
      );
    } else {
      console.log(this.projects);
      this.projects.push(folder);
    }
  }

  saveNewFolder(parentId: string) {
    console.log(parentId, folderObject.folder);
    delete folderObject.folder.new;
    if (parentId.length > 0) {
      loopThroughArrayAndSaveNewFolder(this.projects, parentId);
    } else {
      const index = this.projects.findIndex(
        (folder) => folder.frontendId === folderObject.folder.frontendId
      );
      this.projects[index] = folderObject.folder;
    }

    console.log(this.projects);
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
      console.log(this.projects);
      const newProjectArray = this.projects.filter(
        (folder) => folder.frontendId !== id
      );
      console.log(newProjectArray);
      this.projects = newProjectArray;
    }
  }
}

class FolderObject {
  constructor(public folder: FolderInterface = {}) {}

  setSelectedFolder(folder: FolderInterface) {
    this.folder = folder;
  }

  setNewFolderTitle(title: string) {
    this.folder.name = title;
  }
}

export const folderObject = new FolderObject();
export const defaultFolder = new Folder();
export const userProjects = new UserProjects();
export const projectStore = new ProjectStore();
