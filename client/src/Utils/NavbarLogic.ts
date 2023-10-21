import globalStore from "../Stores/GlobalStore";
import { generateSidebar } from "../Components/Sidebar/Sidebar";
import { generateNewNote } from "../Components/NoteEditor/NoteEditor";

export const navbarNavigationLogic = (): void => {
  const newNoteLi = document.querySelector(".nbcInnerDiv1Con2") as HTMLElement;
  const allNotesLi = document.querySelector(".allNotesLi") as HTMLElement; // stavljanje as HTMLElement je moje obecanje tsu da je to UVIJEK html element!
  const todoListLi = document.querySelector(".todoListLi") as HTMLElement;
  const loginLi = document.querySelector(".loginLi") as HTMLElement;

  toggleSidebar(allNotesLi);
  toggleNoteEditor(newNoteLi);
  addEventListenerForEachNavItem(todoListLi);
};

export const sidebarNavigationLogic = (): void => {
  const closeSidebarSvg = document.querySelector(".sidebarSvg") as HTMLElement;

  closeSidebarSvg.addEventListener("click", () =>
    toggleSidebar(closeSidebarSvg)
  );
};

export const isSidebarVisible = (): void => {
  const sidebarVisible = globalStore.state.sidebarVisible;

  if (sidebarVisible) {
    let div = document.createElement("div");
    div.id = "sidebar-container";
    document.body.appendChild(div);
    document
      .getElementById("sidebar-container")
      ?.appendChild(generateSidebar());
    sidebarNavigationLogic();
  } else {
    document.getElementById("sidebar-container")?.remove();
  }
};

export const isNoteEditorVisible = (): void => {
  const noteEditorVisible = globalStore.state.newNoteVisible;

  if (noteEditorVisible) {
    console.log("da");
    let div = document.createElement("div");
    div.id = "note-container";
    document.body.appendChild(div);
    document.getElementById("note-container")?.appendChild(generateNewNote());
  } else {
    document.getElementById("note-container")?.remove();
  }
};

export const toggleSidebar = (liItem: HTMLElement): void =>
  liItem.addEventListener("click", (): void => {
    globalStore.set("sidebarVisible", !globalStore.state.sidebarVisible);
  });

const addEventListenerForEachNavItem = (li: HTMLElement): void => {
  li.addEventListener("click", (): void => {
    globalStore.set("sidebarVisible", true);
    console.log(globalStore.state.sidebarVisible);
  });
};

const toggleNoteEditor = (liItem: HTMLElement): void =>
  liItem.addEventListener("click", (): void => {
    console.log(globalStore.state.newNoteVisible);
    globalStore.set("newNoteVisible", !globalStore.state.newNoteVisible);
  });
