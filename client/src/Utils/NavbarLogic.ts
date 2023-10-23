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
};

export const sidebarNavigationLogic = (): void => {
  const closeSidebarSvg = document.querySelector(".sidebarSvg") as HTMLElement;

  closeSidebarSvg.addEventListener("click", () =>
    //ovo je zapravo toggleSidebar funckija jer ne zelim poduplati event listener
    globalStore.set("sidebarVisible", !globalStore.state.sidebarVisible)
  );
};

export const isSidebarVisible = (): void => {
  const sidebarVisible = globalStore.state.sidebarVisible;
  const noteEditorVisible = globalStore.state.noteEditorVisible;
  let noteEditorDiv = {} as HTMLElement;

  if (noteEditorVisible)
    noteEditorDiv = document.getElementById("note-container") as HTMLElement;

  if (sidebarVisible) {
    createSidebar(noteEditorVisible, noteEditorDiv);
    sidebarNavigationLogic();
  } else {
    document.getElementById("sidebar-container")?.remove();
  }
};

export const isNoteEditorVisible = (): void => {
  const noteEditorVisible = globalStore.state.noteEditorVisible;

  if (noteEditorVisible) {
    history.pushState(null, "", "/notes");
    createNoteEditor();
  } else {
    history.pushState(null, "", "/");
    document.getElementById("note-container")?.remove();
  }
};

export const toggleSidebar = (liItem: HTMLElement): void =>
  liItem.addEventListener("click", (): void => {
    globalStore.set("sidebarVisible", !globalStore.state.sidebarVisible);
  });

const toggleNoteEditor = (liItem: HTMLElement): void => {
  liItem.addEventListener("click", (): void => {
    globalStore.set("noteEditorVisible", !globalStore.state.noteEditorVisible);
  });
};

const createNoteEditor = (): void => {
  let div = document.createElement("div");
  div.id = "note-container";
  document.body.appendChild(div);
  document.getElementById("note-container")?.appendChild(generateNewNote());
};

const createSidebar = (
  noteEditorVisible: string | number | boolean,
  noteEditorDiv: HTMLElement
): void => {
  let div = document.createElement("div");
  div.id = "sidebar-container";
  if (noteEditorVisible) document.body.insertBefore(div, noteEditorDiv);
  else document.body.appendChild(div);
  document.getElementById("sidebar-container")?.appendChild(generateSidebar());
};
