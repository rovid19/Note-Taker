interface InitialState {
  isUserLoggedIn: boolean;
  [key: string]: any;
}

type Listener = (key: any, value: any) => void;

const initialState = {
  isUserLoggedIn: false,
};

class UserStore {
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

class User {
  email: string;
  username: string;
  password: string;
  confirmedPassword: string;
  id: string;

  constructor(
    email: string,
    username: string,
    password: string,
    confirmedPassword: string,
    id: string
  ) {
    (this.email = email),
      (this.username = username),
      (this.password = password);
    this.confirmedPassword = confirmedPassword;
    this.id = id;
  }

  setUser(
    email: string,
    username: string,
    password: string,
    confirmedPassword: string,
    id: string
  ) {
    (this.email = email),
      (this.username = username),
      (this.password = password);
    this.confirmedPassword = confirmedPassword;
    this.id = id;
  }
  setEmail(email: string) {
    this.email = email;
  }
  setUsername(username: string) {
    this.username = username;
  }
  setPassword(password: string) {
    this.password = password;
  }
  setConfirmedPassword(confirmedPassword: string) {
    this.confirmedPassword = confirmedPassword;
  }
}

export const userStore = new UserStore();
export const defaultUser = new User("", "", "", "", "");
