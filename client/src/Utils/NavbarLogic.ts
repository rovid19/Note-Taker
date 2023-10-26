import globalStore from "../Stores/GlobalStore";
import {
  generateSidebar,
  getUserNotesLength,
  mapOverAllNotes,
} from "../Components/Sidebar/Sidebar";
import { generateNewNote } from "../Components/NoteEditor/NoteEditor";
import noteService from "../Services/NoteService";
import { fullDate } from "./Date";

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

export const isSidebarVisible = async () => {
  const sidebarVisible = globalStore.state.sidebarVisible;
  const noteEditorVisible = globalStore.state.noteEditorVisible;
  let noteEditorDiv = {} as HTMLElement;

  if (noteEditorVisible)
    noteEditorDiv = document.getElementById("note-container") as HTMLElement;

  if (sidebarVisible) {
    await noteService.fetchAllUserNotes();
    createSidebar(noteEditorVisible, noteEditorDiv);
    getUserNotesLength();
    mapOverAllNotes();
    sidebarNavigationLogic();
  } else {
    document.getElementById("sidebar-container")?.remove();
  }
};

export const isNoteEditorVisible = (): void => {
  const noteEditorVisible = globalStore.state.noteEditorVisible;

  if (noteEditorVisible) {
    history.pushState(null, "", "/notes");
    //
    noteService.createNewNote(fullDate);
    history.pushState(null, "", `/notes/${globalStore.get("newNoteId")}`);
    //
    createNoteEditor();
  } else {
    history.pushState(null, "", "/");
    document.getElementById("note-container")?.remove();
  }
};

export const isNewNoteOrExistingNote = (): void => {};

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

  noteEditorEventListeners();
};

const noteEditorEventListeners = (): void => {
  const noteTitleElement = document.querySelector(
    ".newNoteInput"
  ) as HTMLElement;
  const noteTextElement = document.querySelector(
    ".newNoteInputText"
  ) as HTMLElement;
  let oldNoteTitle = globalStore.get("noteTitle");

  gatherNoteIdFromUrl();
  noteTitleElement.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    globalStore.set("noteTitle", value);
  });

  noteTextElement.addEventListener("click", (): void => {
    const newNoteTitle = globalStore.get("noteTitle") as string;
    const noteId = globalStore.get("noteId") as string;
    if (oldNoteTitle !== newNoteTitle) {
      noteService.saveNewNoteTitle(newNoteTitle, noteId);
      oldNoteTitle = newNoteTitle;
    }
  });
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

const gatherNoteIdFromUrl = () => {
  const url = window.location.pathname;
  const noteIdfromUrl = url.slice(7, url.length);
  globalStore.set("noteId", noteIdfromUrl);
};
