export type todoItem = {
  name: string;
  isDone: boolean;
};

export type todo = {
  name: string;
  dateCreated: string;
  todoItems: todoItem[];
  type: string;
};

export interface FolderInterface {
  name: string;
  dateCreated: string;
  content: (FolderInterface | string)[];
  notes: Note[];
  type: string;
  depth: number;
  _id: string;
  frontendId: string;
  parentId?: string;
  new?: boolean;
  id?: string;
}

export type UserNotes = {
  [key: string]: string;
};

export type Note = {
  title: string;
  id: string;
  noteText: string;
  dateCreated: string;
  type: string;
  new?: boolean;
  frontendId?: string;
};

export type Item = todo & FolderInterface & Note;

export type CounterArr = CounterArrItem[];

export type CounterArrItem = {
  id: string;
  subfolders: FolderInterface[];
};

export type NoteEdits = {
  option: string;
  startIndex: number;
  endIndex: number;
};
