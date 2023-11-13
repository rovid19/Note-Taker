import { projectService } from "../../../Services/ProjectService";
import { projectStore } from "../../../Stores/ProjectStore";
import { defaultUser } from "../../../Stores/UserStore";
import { fullDate } from "../../../Utils/Date";

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
  const closePopup = document.querySelector(".backSvg") as HTMLElement;
  const folderTitleInput = document.querySelector(
    ".newFolderInput"
  ) as HTMLElement;
  createFolder.addEventListener("click", (): void => {
    const folderTitle = projectStore.get("newFolderTitle") as string;
    projectStore.set("isCreateNewFolderVisible", false);
    projectService.addNewFolder(defaultUser.id, folderTitle, "", fullDate);
  });
  closePopup.addEventListener("click", () =>
    projectStore.set("isCreateNewFolderVisible", false)
  );

  folderTitleInput.addEventListener("input", (e: Event): void => {
    const target = e.target as HTMLInputElement;
    projectStore.set("newFolderTitle", target.value);
  });
};
