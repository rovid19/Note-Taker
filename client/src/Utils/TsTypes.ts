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
  content: FolderInterface | todo;
  type: string;
  openSubfolders: number[];
  _id: string;
}

export type UserNotes = {
  [key: string]: string;
};

export type Note = {
  title: string;
  noteText: string;
  dateCreated: string;
  type: string;
};

export type Item = todo & FolderInterface & Note;

export type CounterArr = CounterArrItem[];

export type CounterArrItem = {
  id: string;
  subfolders: FolderInterface[];
};
