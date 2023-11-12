interface InitialState {
  noteId: string;
  noteTitle: string;
  userNotes: string[];
  deleteNote: number | null;
  notesLength: number;
  existingNote: boolean;
  [key: string]: any;
}

type Listener = (key: any, value: any) => void;

const initialState = {
  noteId: "",
  noteTitle: "",
  userNotes: [],
  notesLength: 0,
  existingNote: false,
  deleteNote: null,
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

export const noteStore = new NoteStore();
