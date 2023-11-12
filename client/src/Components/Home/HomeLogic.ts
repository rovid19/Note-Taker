import globalStore from "../../Stores/GlobalStore";
import { generateHome } from "./Home";

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
  document.body.appendChild(homeDiv).appendChild(generateHome());
  homeEventListeners();
};

const homeEventListeners = (): void => {
  const newProjectBtn = document.querySelector(".newProjectBtn") as HTMLElement;
  startNewProjectButton(newProjectBtn);
};

const startNewProjectButton = (newProjectBtn: HTMLElement): void => {
  const sidebarVisible = globalStore.get("sidebarVisible");
  newProjectBtn.addEventListener("click", (): void => {
    // if (!sidebarVisible) openSidebar();
  });
};
