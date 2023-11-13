import {
  FolderInterface,
  todo,
  todoItem,
} from "../Components/Sidebar/SidebarLogic";

interface InitialState {
  [key: string]: any;
}

type Listener = (key: any, value: any) => void;

const initialState = {
  isCreateNewFolderVisible: false,
  newFolderTitle: "",
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

  set(key: string, value: string | number | boolean | null): void {
    if (this.state[key] !== value) {
      this.state[key] = value;
      this.notify(key, value);
    }
  }

  notify(key: string, value: string | number | boolean | null): void {
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
  folderName: string;
  folderId: string;
  folderContent: FolderInterface[];

  userFolder: any[];
  constructor(
    folderName: string,
    folderId: string,
    folderContent: FolderInterface[],
    userFolder: any[]
  ) {
    (this.folderName = folderName),
      (this.folderId = folderId),
      (this.folderContent = folderContent),
      (this.userFolder = userFolder);
  }

  addFolder(newFolder: {}) {
    this.userFolder.push(newFolder);
  }

  setAllFolders(allFolders: any[]) {
    this.userFolder = allFolders;
  }

  selectedFolder(
    folderName: string,
    folderId: string,
    folderContent: FolderInterface[]
  ) {
    (this.folderName = folderName),
      (this.folderId = folderId),
      (this.folderContent = folderContent);
  }
}

export const defaultFolder = new Folder("", "", [], []);
export const projectStore = new ProjectStore();
