import { projectService } from "../../Services/ProjectService";
import { userApiRequest } from "../../Services/UserService";
import globalStore from "../../Stores/GlobalStore";
import { defaultUser, userStore } from "../../Stores/UserStore";
import { reRenderPicture, toggleLogin } from "../Navbar/NavbarLogic";
import { generateRegister, generateLogin } from "./UserAuth";

export const createUserAuth = (): void => {
  const div = document.createElement("div");
  div.className = "user-auth-container";

  mutationObserverForChangesInUserAuth(div);
  document.body.appendChild(div).appendChild(generateLogin());
};

export const isLoginVisible = (): void => {
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
  new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        switchEventListeners();
      }
    }
  }).observe(div, config);
};

const loginInputData = (): void => {
  const email = document.getElementById("email") as HTMLElement;
  const password = document.getElementById("password") as HTMLElement;
  const elementArray = [email, password];

  elementArray.forEach((item) => {
    item.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;

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

export const redirectAfterLogin = (): void => {
  const userAuthDiv = document.querySelector(".user-auth-container");
  userAuthDiv?.remove();
  projectService.fetchAllUserProjects(defaultUser.id);
  userStore.set("isUserLoggedIn", true);
};

export const isUserLoggedIn = (): void => {
  const isUserLoggedIn = userStore.get("isUserLoggedIn");

  if (isUserLoggedIn) {
    const username = document.querySelector(".username") as HTMLElement;
    const logoutBtn = document.querySelector(".loginLi") as HTMLElement;

    username.textContent = defaultUser.username;
    logoutBtn.innerHTML = `<div class="mainLiDiv"><div class="liDiv1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
  
    </div><div class="liDiv2">Logout</div></div>`;
    reRenderPicture();
    toggleLogin();
  } else {
    const username = document.querySelector(".username") as HTMLElement;
    const loginBtn = document.querySelector(".loginLi") as HTMLElement;

    username.textContent = "Guest";
    loginBtn.innerHTML = `<div class="mainLiDiv"><div class="liDiv1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
  
   </svg>
    </div><div class="liDiv2">Login</div></div>`;
    defaultUser.setUser("", "Guest", "", "", "");
    reRenderPicture();
    toggleLogin();
  }
};
