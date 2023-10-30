interface InitialState {
  sidebarVisible: boolean;
  noteEditorVisible: boolean;
  todoListVisible: boolean;
  url: string;
  noteId: string;
  noteTitle: string;
  userNotes: string[];
  deleteNote: number | null;
  notesLength: number;
  existingNote: boolean;
  loginVisible: boolean;
  loginOrRegister: string;
  [key: string]: any;
}

type Listener = (key: any, value: any) => void;

class GlobalStore {
  state: InitialState;
  listeners: { [key: string]: Listener[] };

  constructor(newStore: InitialState = intialState) {
    this.state = { ...newStore };
    this.listeners = {};
  }

  get(key: string): string | undefined | number | boolean {
    return this.state[key];
  }

  set(key: string, value: string | number | boolean): void {
    if (this.state[key] !== value) {
      this.state[key] = value;
      this.notify(key, value);
    }
  }

  notify(key: string, value: string | number | boolean): void {
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

const intialState = {
  sidebarVisible: false,
  noteEditorVisible: false,
  todoListVisible: false,
  url: "/",
  noteId: "",
  noteTitle: "",
  userNotes: [],
  notesLength: 0,
  existingNote: false,
  loginVisible: false,
  loginOrRegister: "",
  deleteNote: null,
};

export default new GlobalStore();
