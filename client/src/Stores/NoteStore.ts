import { Note, NoteEdits, SelectedText } from "../Utils/TsTypes";

interface InitialState {
  noteTitle: string;
  userNotes: string[];
  deleteNote: number | null;
  notesLength: number;
  isNewNote: boolean;
  selectedText: SelectedText;
  [key: string]: any;
}

type Listener = (key: any, value: any) => void;

const initialState = {
  noteTitle: "",
  userNotes: [],
  notesLength: 0,
  isNewNote: false,
  deleteNote: null,
  selectedText: { startIndex: 0, endIndex: 0 },
};

class NoteStore {
  state: InitialState;
  listeners: { [key: string]: Listener[] };

  constructor(newStore: InitialState = initialState) {
    this.state = { ...newStore };
    this.listeners = {};
  }

  get(key: string): string | undefined | number | boolean {
    return this.state[key];
  }

  set(
    key: string,
    value: string | number | boolean | null | Note | SelectedText
  ): void {
    if (this.state[key] !== value) {
      this.state[key] = value;
      this.notify(key, value);
    }
  }

  notify(
    key: string,
    value: string | number | boolean | null | Note | SelectedText
  ): void {
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

class NoteObject {
  constructor(
    public title: string = "",
    public noteText: string = "",
    public id: string = "",
    public type: string = "note",
    public parentId: string = "",
    public noteEdits: NoteEdits[] = []
  ) {}

  setNote(title: string, noteText: string, id: string, parentId: string) {
    (this.title = title),
      (this.noteText = noteText),
      (this.id = id),
      (this.parentId = parentId);
  }
  setTitle(newTitle: string) {
    this.title = newTitle;
  }
  setText(newText: string) {
    this.noteText = newText;
  }
  setId(newId: string) {
    this.id = newId;
  }

  pushEdit(editObject: NoteEdits) {
    if (this.noteEdits.length > 0) {
      const isEditAlreadyInside = this.noteEdits.find(
        (edit) =>
          edit.startIndex === editObject.startIndex &&
          edit.endIndex === editObject.endIndex
      );

      if (isEditAlreadyInside) {
        const index = this.noteEdits.findIndex(
          (edit) => edit === isEditAlreadyInside
        );
        this.noteEdits[index] = editObject;
      } else {
        this.noteEdits.push(editObject);
      }
    } else {
      this.noteEdits.push(editObject);
    }
  }
}

export const noteStore = new NoteStore();
export const noteObject = new NoteObject();
export const noteObjectChanges = new NoteObject();
