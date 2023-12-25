import { userApiRequest } from "../../Services/UserService";
import globalStore from "../../Stores/GlobalStore";
import { noteStore } from "../../Stores/NoteStore";
import {
  projectStore,
  searchArray,
  userProjects,
} from "../../Stores/ProjectStore";
import { defaultUser, userStore } from "../../Stores/UserStore";
import { router } from "../../Utils/Router/Router";
import { FolderInterface } from "../../Utils/TsTypes";
import { createAllFolderContainer } from "../Sidebar/SidebarLogic";

export const navbarNavigationLogic = (): void => {
  const allNotesLi = document.querySelector(".allNotesLi") as HTMLElement; // stavljanje as HTMLElement je moje obecanje tsu da je to UVIJEK html element!
  const todoListLi = document.querySelector(".todoListLi") as HTMLElement;
  const homeLi = document.querySelector(".homeLi") as HTMLElement;
  const newNotePopup = document.querySelector(
    ".navbarBottomContainerInnerDiv1"
  ) as HTMLElement;
  const searchInput = document.querySelector(".search") as HTMLElement;

  toggleSidebar(allNotesLi);
  openTodoList(todoListLi);
  openHome(homeLi);
  openNewNotePopup(newNotePopup);
  search(searchInput);

  toggleLogin();
};

const toggleSidebar = (liItem: HTMLElement): void => {
  liItem.addEventListener("click", (): void => {
    if (!defaultUser.email) {
      alert("you must login first");
    } else {
      const url = window.location.pathname;
      if (url.includes("/projects")) {
      } else router.navigateTo("/projects");
    }
  });
};

const search = (liItem: HTMLElement): void => {
  liItem.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLInputElement;
    projectStore.set("searchInput", target.value);
  });
};

const openNewNotePopup = (liItem: HTMLElement): void => {
  liItem.addEventListener("click", (): void => {
    if (!defaultUser.email) {
      alert("you must login first");
    } else globalStore.set("newNotePopupVisible", true);
  });
};

const openHome = (liItem: HTMLElement): void => {
  liItem.addEventListener("click", (): void => {
    if (!defaultUser.email) {
      alert("you must login first");
    } else {
      const sidebarVisible = globalStore.get("sidebarVisible");
      if (sidebarVisible) router.navigateTo("/projects/home");
      else router.navigateTo("/home ");
    }
  });
};

const openTodoList = (liItem: HTMLElement): void => {
  liItem.addEventListener("click", (): void => {
    if (!defaultUser.email) {
      alert("you must login first");
    } else {
      const sidebarVisible = globalStore.get("sidebarVisible");
      if (sidebarVisible) router.navigateTo("/projects/dailytodo");
      else router.navigateTo("/dailytodo");
    }
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
};

const handleLogout = async () => {
  await userApiRequest.logoutUser();
  globalStore.set("loginVisible", false);
  noteStore.set("noteIdFromUrl", null);
  router.navigateTo("/home");
};

export const setSearchActiveAccordingToSearchInput = () => {
  const searchInput = projectStore.get("searchInput") as string;

  if (searchInput.length > 0) {
    projectStore.set("searchActive", true);
    searchArray.replaceArray([]);
    displayedProjectsBySearchedKeyword();
    renderFoldersAccordinglyToSearchedArray("search");
  } else {
    projectStore.set("searchActive", false);
    renderFoldersAccordinglyToSearchedArray("");
  }
};

export const displayedProjectsBySearchedKeyword = () => {
  const projects = userProjects.projects as unknown as FolderInterface[];
  const searchInput = projectStore.get("searchInput") as string;
  loopThroughProjectsAndIfMatchedAddToSearchedArray(projects, searchInput);
};

const loopThroughProjectsAndIfMatchedAddToSearchedArray = (
  projects: FolderInterface[],
  searchInput: string
) => {
  for (let folder of projects) {
    if (folder.name.includes(searchInput)) {
      searchArray.push(folder);
    }
    if (folder.content.length > 0) {
      const folderContent = folder.content.filter(
        (item): item is FolderInterface => typeof item !== "string"
      );

      loopThroughProjectsAndIfMatchedAddToSearchedArray(
        folderContent,
        searchInput
      );
    }
  }
};

const renderFoldersAccordinglyToSearchedArray = (purpose: string) => {
  deletePreviousFoldersInSidebar();
  if (purpose === "search") {
    createAllFolderContainer("search");
  } else {
    createAllFolderContainer("");
  }
};
const deletePreviousFoldersInSidebar = () => {
  document.body.querySelector(".sidebarDiv2")?.remove();
};
