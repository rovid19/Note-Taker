import globalStore from "../../Stores/GlobalStore";
import { autoSaveNote } from "../NoteEditor/NoteEditorLogic";

export const navbarNavigationLogic = (): void => {
  const newNoteLi = document.querySelector(".nbcInnerDiv1Con2") as HTMLElement;
  const allNotesLi = document.querySelector(".allNotesLi") as HTMLElement; // stavljanje as HTMLElement je moje obecanje tsu da je to UVIJEK html element!
  const todoListLi = document.querySelector(".todoListLi") as HTMLElement;
  const loginLi = document.querySelector(".loginLi") as HTMLElement;

  toggleSidebar(allNotesLi);
  toggleNoteEditor(newNoteLi);
  toggleLogin(loginLi);
};

const toggleSidebar = (liItem: HTMLElement): void => {
  liItem.addEventListener("click", (): void => {
    globalStore.set("sidebarVisible", !globalStore.state.sidebarVisible);
    autoSaveNote();
  });
};
const toggleNoteEditor = (liItem: HTMLElement): void => {
  liItem.addEventListener("click", (): void => {
    globalStore.set("noteEditorVisible", !globalStore.state.noteEditorVisible);
    autoSaveNote();
  });
};

const toggleLogin = (liItem: HTMLElement): void => {
  liItem.addEventListener("click", (): void => {
    globalStore.set("loginVisible", !globalStore.get("loginVisible"));
    autoSaveNote();
  });
};
