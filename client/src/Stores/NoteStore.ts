import { Note, NoteEdits, SelectedText } from "../Utils/TsTypes";

interface InitialState {
  noteTitle: string;
  userNotes: string[];
  deleteNote: number | null;
  notesLength: number;
  isNewNote: boolean;
  selectedText: SelectedText;
  savingNoteInProgress: boolean;
  currentTextIndex: number;
  addedText: string[];
  enterIndex: number;
  fontSize: string;
  editFontSize: number | null;
  backspaceCount: number;
  noteIdFromUrl: string | null;
  [key: string]: any;
}

type Listener = (key: any, value: any) => void;

const initialState = {
  noteTitle: "",
  userNotes: [],
  notesLength: 0,
  isNewNote: false,
  deleteNote: null,
  savingNoteInProgress: false,
  selectedText: { startIndex: 0, endIndex: 0 },
  currentTextIndex: 0,
  enterIndex: 0,
  addedText: [],
  fontSize: "",
  editFontSize: null,
  backspaceCount: 0,
  noteIdFromUrl: "",
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
  push(
    key: string,
    value: string | number | boolean | null | Note | SelectedText
  ) {
    this.state[key].push(value);
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

  setNote(
    title: string,
    noteText: string,
    id: string,
    parentId: string,
    noteEdits: NoteEdits[]
  ) {
    (this.title = title),
      (this.noteText = noteText),
      (this.id = id),
      (this.parentId = parentId);
    this.noteEdits = noteEdits;
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
  setNoteEdit(noteEditArray: NoteEdits[]) {
    this.noteEdits = noteEditArray;
  }

  pushEdit(editObject: NoteEdits) {
    if (this.noteEdits.length > 0) {
      const isEditAlreadyInside = this.noteEdits.find(
        (edit) =>
          edit.startIndex === editObject.startIndex &&
          edit.endIndex === editObject.endIndex
      );
      if (editObject.name === "enter") {
        editObject.startIndex = editObject.startIndex;
        this.noteEdits.push(editObject);
      } else {
        if (isEditAlreadyInside) {
          const index = this.noteEdits.findIndex(
            (edit) => edit === isEditAlreadyInside
          );
          this.noteEdits[index] = editObject;
        } else {
          this.noteEdits.push(editObject);
        }
      }
    } else {
      this.noteEdits.push(editObject);
    }
  }
}

export const noteStore = new NoteStore();
export const noteObject = new NoteObject();
export const noteObjectChanges = new NoteObject();
