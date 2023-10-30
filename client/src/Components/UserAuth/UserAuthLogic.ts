import { userApiRequest } from "../../Services/UserService";
import globalStore from "../../Stores/GlobalStore";
import { defaultUser, userStore } from "../../Stores/UserStore";
import { generateRegister, generateLogin } from "./UserAuth";

export const createUserAuth = (): void => {
  console.log("2");
  const div = document.createElement("div");
  div.className = "user-auth-container";
  mutationObserverForChangesInUserAuth(div);
  document.body.appendChild(div).appendChild(generateLogin());
};

export const isLoginVisible = (): void => {
  console.log("1");
  const loginVisible = globalStore.get("loginVisible");

  if (loginVisible) {
    createUserAuth();
  } else {
    document.querySelector(".user-auth-container")?.remove();
  }
};

const loginEventListeners = (): void => {
  const loginButton = document.querySelector(".userAuthButton") as HTMLElement;
  const registerButton = document.querySelector(".userAuthH4") as HTMLElement;
  const exitButton = document.querySelector(".userAuthSvg") as HTMLElement;
  loginButton?.addEventListener("click", (e: Event): void => {
    e.preventDefault();
    userApiRequest.loginUser(defaultUser.email, defaultUser.password);
  });
  exitUserAuth(exitButton);
  switchToLoginOrRegisterWindow(registerButton, generateRegister);
};

const registerEventListeners = (): void => {
  const loginButton = document.querySelector(".userAuthH4") as HTMLElement;
  const registerButton = document.querySelector(
    ".userAuthButton"
  ) as HTMLElement;
  const exitButton = document.querySelector(".userAuthSvg") as HTMLElement;
  registerButton?.addEventListener("click", (e: Event): void => {
    e.preventDefault();
    if (defaultUser.password === defaultUser.confirmedPassword) {
      console.log("da");
      userApiRequest.registerUser(
        defaultUser.email,
        defaultUser.username,
        defaultUser.password
      );
    }
  });
  exitUserAuth(exitButton);
  switchToLoginOrRegisterWindow(loginButton, generateLogin);
};

const exitUserAuth = (exitButton: HTMLElement): void => {
  exitButton?.addEventListener("click", () => {
    globalStore.set("loginVisible", false);
  });
};

const switchToLoginOrRegisterWindow = (
  registerOrLoginBtn: HTMLElement,
  generateRegisterOrLogin: Function
): void => {
  registerOrLoginBtn?.addEventListener("click", () => {
    const mainDiv = document.querySelector(".user-auth-container");
    document.querySelector(".userAuthMainDiv")?.remove();
    mainDiv?.appendChild(generateRegisterOrLogin());
  });
};

export const switchEventListeners = (): void => {
  console.log("promjena");
  const loginOrRegister = globalStore.get("loginOrRegister");

  if (loginOrRegister === "login") {
    loginEventListeners();
    loginInputData();
  } else {
    registerEventListeners();
    registerInputData();
  }
};

const mutationObserverForChangesInUserAuth = (div: HTMLElement): void => {
  const config = { childList: true };
  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        switchEventListeners();
      }
    }
  });
  observer.observe(div, config);
};

const loginInputData = (): void => {
  const email = document.getElementById("email") as HTMLElement;
  const password = document.getElementById("password") as HTMLElement;
  const elementArray = [email, password];

  elementArray.forEach((item) => {
    item.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;
      console.log(value);
      if (item === email) {
        defaultUser.setEmail(value);
      } else {
        defaultUser.setPassword(value);
      }
    });
  });
};

const registerInputData = (): void => {
  const email = document.getElementById("email") as HTMLElement;
  const username = document.getElementById("username") as HTMLElement;
  const password = document.getElementById("password") as HTMLElement;
  const confirmedPassword = document.getElementById("password2") as HTMLElement;
  const elementArray = [email, username, password, confirmedPassword];

  elementArray.forEach((element) => {
    element.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;

      switch (element) {
        case email:
          defaultUser.setEmail(value);
          console.log(value);
          break;
        case username:
          defaultUser.setUsername(value);
          break;
        case password:
          defaultUser.setPassword(value);
          break;
        case confirmedPassword:
          defaultUser.setConfirmedPassword(value);
          break;
      }
    });
  });
};
