import { FolderInterface } from "../Components/Sidebar/SidebarLogic";

interface InitialState {
  isCreateNewFolderVisible: boolean;
  newFolderTitle: string;
  subFolderVisible: boolean;
  [key: string]: any;
}

type Listener = (key: any, value: any) => void;

const initialState = {
  isCreateNewFolderVisible: false,
  newFolderTitle: "",
  subFolderVisible: false,
  selectedFolder: false,
  selectedFolderDepth: null,
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
  folderContent;
  userFolder;
  constructor(
    folderName: string = "",
    folderId: string = "",
    folderContent: FolderInterface[] = [],
    userFolder: any[] = []
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
  setFolderId(id: string) {
    this.folderId = id;
  }
}

export const defaultFolder = new Folder();
export const projectStore = new ProjectStore();
