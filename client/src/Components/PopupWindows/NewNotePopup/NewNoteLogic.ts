import globalStore from "../../../Stores/GlobalStore";
import { noteObjectChanges } from "../../../Stores/NoteStore";
import { folderObject, userProjects } from "../../../Stores/ProjectStore";
import { defaultUser } from "../../../Stores/UserStore";
import { createNewNote } from "../../NoteEditor/NoteEditorLogic";
import { generateNewNotePopup } from "./NewNote";

export const isNewNotePopupVisible = (): void => {
  const newNotePopupVisible = globalStore.get("newNotePopupVisible");

  if (newNotePopupVisible) {
    createNewNotePopup();
    newNotePopupEventListener();
  } else {
    document.querySelector(".newNotePopupStyles")?.remove();
  }
};

const createNewNotePopup = (): void => {
  document.body.appendChild(generateNewNotePopup());

  mapAllUserFolderToSelect();
};

const newNotePopupEventListener = () => {
  const exitBtn = document.querySelector(".btn");
  const addBtn = document.querySelector(".addSelect") as HTMLElement;

  addBtn.addEventListener("click", () => {
    if (Object.keys(folderObject.folder).length > 1) {
      globalStore.set("newNotePopupVisible", false);
      createNewNote(folderObject.folder.frontendId);
      userProjects.addNewItem(noteObjectChanges, noteObjectChanges.parentId);
    } else {
      alert("you didnt select any folder");
    }
  });
  exitBtn?.addEventListener("click", () => {
    globalStore.set("newNotePopupVisible", false);
  });
};

const mapAllUserFolderToSelect = () => {
  const folderSelect = document.querySelector(".folderSelect") as HTMLElement;
  defaultUser.userFolders.map((folder) => {
    folderSelect.innerHTML += `<option >${folder.name} </option>`;
  });

  folderSelectEventListener(folderSelect);
};

const folderSelectEventListener = (folderSelect: HTMLElement) => {
  if (defaultUser.userFolders.length === 1) {
    folderObject.setSelectedFolder(defaultUser.userFolders[0]);
  }
  folderSelect.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const index = defaultUser.userFolders.findIndex(
      (folder) => folder.name === target.value
    );
    folderObject.setSelectedFolder(defaultUser.userFolders[index]);
  });
};
