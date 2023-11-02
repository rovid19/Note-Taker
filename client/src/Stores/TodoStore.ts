interface InitialState {
  [key: string]: any;
}

type Listener = (key: any, value: any) => void;

const initialState = {
  todoList: [],
};

class TodoStore {
  state: InitialState;
  listeners: { [key: string]: Listener[] };

  constructor(newStore: InitialState = initialState) {
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

  push(key: string, value: string | number | boolean): void {
    this.state[key].push(value);
    this.notify(key, value);
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

class Todo {
  todoItem;
  constructor(todoItem: string) {
    this.todoItem = todoItem;
  }

  addItem(item: string) {
    this.todoItem = item;
  }
}

export const todoStore = new TodoStore();
export const todoList = new Todo("");
