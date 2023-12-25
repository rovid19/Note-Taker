import globalStore from "../../Stores/GlobalStore";
import { defaultUser } from "../../Stores/UserStore";
import { createNewFolderLogic } from "../Sidebar/SidebarLogic";
import { generateHome, generateHomeLoggedOut } from "./Home";

export const isHomeVisible = (): void => {
  const homeVisible = globalStore.get("homeVisible");
  if (homeVisible) {
    createHome();
  } else {
    document.querySelector(".home-container")?.remove();
  }
};

const createHome = (): void => {
  const homeDiv = document.createElement("div");
  homeDiv.className = "home-container";
  if (!defaultUser.email) {
    document.body.appendChild(homeDiv).appendChild(generateHomeLoggedOut());
  } else {
    document.body.appendChild(homeDiv).appendChild(generateHome());
  }

  homeEventListeners();
};

const homeEventListeners = (): void => {
  const sidebarVisible = globalStore.get("sidebarVisible");
  const newProjectBtn = document.querySelector(".newProjectBtn") as HTMLElement;
  newProjectBtn.addEventListener("click", (e: Event) => {
    if (!defaultUser.email) {
      globalStore.set("loginVisible", true);
    } else {
      if (!sidebarVisible) {
        globalStore.set("sidebarVisible", true);
      }
      createNewFolderLogic(e);
    }
  });
};
