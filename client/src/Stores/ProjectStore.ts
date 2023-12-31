import { FolderInterface } from "../Utils/TsTypes";
import {
  loopThroughArrayAndPushOrDeleteFolder,
  loopThroughArrayAndSaveNewFolderItem,
} from "../Utils/GeneralFunctions";
import { Note } from "../Utils/TsTypes";
import { noteObject, noteObjectChanges } from "./NoteStore";

interface InitialState {
  isCreateNewFolderVisible: boolean;
  newFolderTitle: string;
  rightClickVisible: boolean;
  [key: string]: any;
  createNewFolder: boolean;
  subfolderVisible: boolean;
  selectedFolderElement: HTMLElement;
  createMainFolder: boolean;
  subfolderFolderObject: FolderInterface;
  fetchingProjects: boolean;
  userFolders: number;
  currentWidth: number;
  searchActive: boolean;
  searchInput: string;
  searchArray: FolderInterface | Note[] | null;
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
  subfolderFolderObject: {
    name: "",
    dateCreated: "",
    content: [],
    notes: [],
    type: "",
    depth: 0,
    _id: "",
    frontendId: "",
  },
  fetchingProjects: false,
  userFolders: 0,
  currentWidth: 0,
  searchActive: false,
  searchInput: "",
  searchArray: [],
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

  set(
    key: string,
    value:
      | string
      | number
      | boolean
      | null
      | Element
      | FolderInterface
      | never[]
  ): void {
    if (this.state[key] !== value) {
      this.state[key] = value;
      this.notify(key, value);
    }
  }
  notify(
    key: string,
    value:
      | string
      | number
      | boolean
      | null
      | Element
      | FolderInterface
      | never[]
  ): void {
    if (this.listeners[key]) {
      this.listeners[key].forEach((listener) => listener(key, value));
    }
  }
  push(
    key: string,
    value: string | number | boolean | null | FolderInterface | Note
  ) {
    this.state[key].push(value);
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
  constructor(public projects: (FolderInterface | Note)[] = []) {}

  setProjects(projects: FolderInterface[]) {
    this.projects = projects;
  }

  addNewItem(folder: FolderInterface | Note, parentId: string) {
    if (parentId.length > 0) {
      loopThroughArrayAndPushOrDeleteFolder(
        this.projects,
        parentId,
        folder,
        "add"
      );
    } else {
      this.projects.push(folder);
    }
  }

  saveNewFolderItem(parentId: string, purpose: string) {
    if (purpose === "folder") {
      console;
      delete folderObject.folder.new;
      if (parentId.length > 0) {
        loopThroughArrayAndSaveNewFolderItem(this.projects, parentId, "folder");
      } else {
        const index = this.projects.findIndex(
          (folder) => folder.frontendId === folderObject.folder.frontendId
        );
        this.projects[index] = folderObject.folder;
      }
    } else {
      loopThroughArrayAndSaveNewFolderItem(this.projects, parentId, "note");
    }
  }
  deleteFolder(id: string, item: FolderInterface | Note) {
    if ("noteText" in item) {
      loopThroughArrayAndPushOrDeleteFolder(
        this.projects,
        noteObjectChanges.parentId,
        item,
        "delete",
        noteObject.id
      );
    } else {
      if (item.depth > 0) {
        loopThroughArrayAndPushOrDeleteFolder(
          this.projects,
          folderObject.folder.parentId as string,
          item,
          "delete",
          folderObject.folder.frontendId
        );
      } else {
        const newProjectArray = this.projects.filter(
          (item) => item.frontendId !== id
        );
        this.projects = newProjectArray;
      }
    }
  }
}

class FolderObject {
  constructor(
    public folder: FolderInterface = {
      name: "",
      dateCreated: "",
      content: [],
      notes: [],
      type: "",
      depth: 0,
      _id: "",
      frontendId: "",
    }
  ) {}

  setSelectedFolder(folder: FolderInterface) {
    this.folder = folder;
  }

  setNewFolderTitle(title: string) {
    this.folder.name = title;
  }
}

class SearchArray {
  constructor(public projects: FolderInterface[] = []) {}

  replaceArray(newArr: FolderInterface[]) {
    this.projects = newArr;
  }
  push(folder: FolderInterface) {
    this.projects.push(folder);
  }
}

export const folderObject = new FolderObject();
export const defaultFolder = new Folder();
export const userProjects = new UserProjects();
export const projectStore = new ProjectStore();
export const searchArray = new SearchArray();
