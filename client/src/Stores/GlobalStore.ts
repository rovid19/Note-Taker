interface InitialState {
  [key: string]: string | number; // ovo znaci da na objektu koji koristi ovaj interface bilo koji key/index je string, npr. intialState[tu uvijek dolazi string]
}

type Listener = (key: string, value: string | number) => void;

class GlobalStore {
  state: InitialState;
  listeners: { [key: string]: Listener[] };

  constructor(newStore: InitialState = {}) {
    this.state = { ...newStore };
    this.listeners = {};
  }

  get(key: string): string | undefined | number {
    return this.state[key];
  }

  set(key: string, value: string | number): void {
    console.log(key, value);
    if (this.state[key] !== value) {
      this.state[key] = value;
      this.notify(key, value);
    }
  }

  notify(key: string, value: string | number): void {
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

export default new GlobalStore();
