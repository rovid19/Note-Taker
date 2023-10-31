import { userApiRequest } from "../../Services/UserService";
import globalStore from "../../Stores/GlobalStore";
import { defaultUser, userStore } from "../../Stores/UserStore";
import { autoSaveNote } from "../NoteEditor/NoteEditorLogic";

export const navbarNavigationLogic = (): void => {
  const newNoteLi = document.querySelector(".nbcInnerDiv1Con2") as HTMLElement;
  const allNotesLi = document.querySelector(".allNotesLi") as HTMLElement; // stavljanje as HTMLElement je moje obecanje tsu da je to UVIJEK html element!
  const todoListLi = document.querySelector(".todoListLi") as HTMLElement;

  toggleSidebar(allNotesLi);
  toggleNoteEditor(newNoteLi);
  toggleLogin();
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

export const toggleLogin = (): void => {
  console.log("pokrenut");
  const liItem = document.querySelector(".loginLi") as HTMLElement;
  const isUserLoggedIn = userStore.get("isUserLoggedIn");

  liItem.removeEventListener("click", handleLogin);
  liItem.removeEventListener("click", handleLogout);

  if (isUserLoggedIn) {
    liItem.addEventListener("click", handleLogout);
  } else {
    liItem.addEventListener("click", handleLogin);
  }
};

export const reRenderPicture = (): void => {
  const picture = document.querySelector(".pictureDiv") as HTMLElement;
  const firstLetterOfUsername = defaultUser.username.slice(0, 1).toUpperCase();

  picture.textContent = firstLetterOfUsername;
};

const handleLogin = (): void => {
  console.log(globalStore.get("loginVisible"));
  globalStore.set("loginVisible", true);
  console.log(globalStore.get("loginVisible"));
  autoSaveNote();
};

const handleLogout = (): void => {
  userApiRequest.logoutUser();
  globalStore.set("loginVisible", false);
  autoSaveNote();
};
