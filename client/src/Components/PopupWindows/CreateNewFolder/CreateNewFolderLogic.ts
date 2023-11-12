import { projectStore } from "../../../Stores/ProjectStore";

import { generateCreateNewFolder } from "./CreateNewFolder";

export const isCreateNewFolderVisible = (): void => {
  const isNewFolderVisible = projectStore.get("isCreateNewFolderVisible");

  if (isNewFolderVisible) {
    createNewFolder();
  } else {
    document.querySelector(".newfolder-container")?.remove();
  }
};

const createNewFolder = (): void => {
  const div = document.createElement("div");
  div.className = "newfolder-container";
  document.body.appendChild(div).appendChild(generateCreateNewFolder());

  newFolderEventListeners();
};

const newFolderEventListeners = (): void => {
  const createFolder = document.querySelector(
    ".addNewFolderButton"
  ) as HTMLElement;
  createFolder.addEventListener("click", (): void => {});
};
