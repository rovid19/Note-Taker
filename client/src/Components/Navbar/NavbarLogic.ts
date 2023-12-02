import { userApiRequest } from "../../Services/UserService";
import globalStore from "../../Stores/GlobalStore";
import { defaultUser, userStore } from "../../Stores/UserStore";
import { router } from "../../Utils/Router/Router";
//import { autoSaveNote } from "../NoteEditor/NoteEditorLogic";

export const navbarNavigationLogic = (): void => {
  const newNoteLi = document.querySelector(".nbcInnerDiv1Con2") as HTMLElement;
  const allNotesLi = document.querySelector(".allNotesLi") as HTMLElement; // stavljanje as HTMLElement je moje obecanje tsu da je to UVIJEK html element!
  const todoListLi = document.querySelector(".todoListLi") as HTMLElement;
  const homeLi = document.querySelector(".homeLi") as HTMLElement;

  toggleSidebar(allNotesLi);
  openNoteEditor(newNoteLi);
  openTodoList(todoListLi);
  openHome(homeLi);
  toggleLogin();
};

const toggleSidebar = (liItem: HTMLElement): void => {
  liItem.addEventListener("click", (): void => {
    const url = window.location.pathname;
    if (url.includes("/projects")) {
    } else router.navigateTo("/projects");
    //autoSaveNote();
  });
};

const openNoteEditor = (liItem: HTMLElement): void => {
  liItem.addEventListener("click", (e: Event): void => {
    e.preventDefault();
    router.navigateTo("/note");
    //autoSaveNote();
  });
};

const openHome = (liItem: HTMLElement): void => {
  liItem.addEventListener("click", (): void => {
    const sidebarVisible = globalStore.get("sidebarVisible");
    if (sidebarVisible) router.navigateTo("/projects/home");
    else router.navigateTo("/home ");
    //autoSaveNote();
  });
};

const openTodoList = (liItem: HTMLElement): void => {
  liItem.addEventListener("click", (e: Event): void => {
    const sidebarVisible = globalStore.get("sidebarVisible");
    if (sidebarVisible) router.navigateTo("/projects/dailytodo");
    else router.navigateTo("/dailytodo");
    //autoSaveNote();
  });
};

export const toggleLogin = (): void => {
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
  globalStore.set("loginVisible", true);
  //autoSaveNote();
};

const handleLogout = (): void => {
  userApiRequest.logoutUser();
  globalStore.set("loginVisible", false);
  //autoSaveNote();
};
