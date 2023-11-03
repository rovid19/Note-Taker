interface InitialState {
  [key: string]: any;
}

type Listener = (key: any, value: any) => void;

const initialState = {
  todoIndex: null,
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

  set(key: string, value: string | number | boolean | null): void {
    if (this.state[key] !== value) {
      this.state[key] = value;
      this.notify(key, value);
    }
  }

  /*push(key: string, value: string | number | boolean): void {
    this.state[key].push(value);
    this.notify(key, value);
  }*/

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

class Todo {
  todoList;
  constructor(todoList: string[]) {
    this.todoList = todoList;
  }

  addItem(item: string) {
    this.todoList.push(item);
  }
  deleteTodoItem(index: number) {
    const newArray = this.todoList.filter((item, i) => i !== index);
    this.todoList = newArray;
    console.log(this.todoList);
  }
}

export const todoStore = new TodoStore();
export const todoList = new Todo([]);
