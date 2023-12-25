import globalStore from "../../Stores/GlobalStore";
import { generateSidebar } from "./Sidebar";
import { router } from "../../Utils/Router/Router";
import { extractProjectFromUrl } from "../../Utils/Router/RouterLogic";
import {
  folderObject,
  searchArray,
  userProjects,
} from "../../Stores/ProjectStore";
import { FolderInterface, Note } from "../../Utils/TsTypes";
import {
  closeRightClickMenuIfOpen,
  eventDelegationForProjects,
} from "./SidebarFolderLogic";
import { projectStore } from "../../Stores/ProjectStore";
import { noteStore } from "../../Stores/NoteStore";

export const isSidebarVisible = async () => {
  const sidebarVisible = globalStore.state.sidebarVisible;
  const noteEditorVisible = globalStore.state.noteEditorVisible;
  const todoListVisible = globalStore.get("todoListVisible") as boolean;
  const homeVisible = globalStore.get("homeVisible") as boolean;

  const todoOrNoteElement = whichEditorIsActive(
    noteEditorVisible,
    homeVisible
  ) as HTMLElement;

  if (sidebarVisible) {
    createSidebar(
      noteEditorVisible,
      todoOrNoteElement,
      todoListVisible,
      homeVisible
    );
    sidebarEventListeners();
    renderTotalNumberOfUserProjects();
    createAllFolderContainer("");
    sidebarNavigationLogic();
  } else {
    document.getElementById("sidebar-container")?.remove();
    window.removeEventListener("click", closeRightClickMenuIfOpen);
    removeUrl();
    noteStore.set("noteIdFromUrl", null);
  }
};

const removeUrl = (): void => {
  setTimeout(() => {
    const url = window.location.pathname;
    const newUrl = extractProjectFromUrl(url);
    window.history.replaceState({}, "", newUrl);
  }, 0);
};

const whichEditorIsActive = (
  noteEditorVisible: string | number | boolean,
  homeVisible: boolean
): HTMLElement => {
  return noteEditorVisible
    ? (document.getElementById("note-container") as HTMLElement)
    : homeVisible
    ? (document.querySelector(".home-container") as HTMLElement)
    : (document.querySelector(".todo-container") as HTMLElement);
};

export const sidebarNavigationLogic = (): void => {
  const closeSidebarSvg = document.querySelector(".sidebarSvg") as HTMLElement;

  window.addEventListener("click", closeRightClickMenuIfOpen);

  closeSidebarSvg.addEventListener("click", () => {
    const url = window.location.pathname.replace("/projects", "");
    router.navigateTo(url);
  });
};

export const createAllFolderContainer = (purpose: string): void => {
  const div = document.createElement("div");
  div.className = "sidebarDiv2";
  const sidebarStyles = document.querySelector(".sidebarStyles") as HTMLElement;

  if (purpose === "search") mapOverAllUserProjects(searchArray.projects, div);
  else mapOverAllUserProjects(userProjects.projects, div);

  sidebarStyles.appendChild(div);
  const sidebarDiv2 = document.querySelector(".sidebarDiv2") as HTMLElement;

  eventDelegationForProjects(sidebarDiv2);
};

export const reRenderAllFolderContainer = () => {
  document.querySelector(".sidebarDiv2")?.remove();
  createAllFolderContainer("");
};

export const mapOverAllUserProjects = (
  userFolders: (FolderInterface | Note)[],
  div: HTMLElement
): void => {
  const searchActive = projectStore.get("searchActive");
  if (searchActive && searchArray.projects.length === 0) {
    console.log("ayo");
    const div2 = document.createElement("div");
    div2.className = "noFolderDisplayDiv";
    div2.innerHTML = `<h4 class="noDisplayH1"> No folders have been found </h4> `;
    div.appendChild(div2);
  } else {
    if (userFolders.length === 0) {
      createNewFolderButton(div);
      const noFolderDisplay = document.body.querySelector(
        ".noFolderDisplayDiv"
      ) as HTMLElement;
      if (noFolderDisplay) {
        document.body.querySelector(".noFolderDisplayDiv")?.remove();
      }
    } else {
      userFolders.map((folder) => {
        if ("content" in folder)
          return (div.innerHTML += `
      <article class="sidebarArticle" data-id=${
        folder.frontendId
      } data-mainfolder=${folder._id} data-type="folder">  
        <div class="articleInnerDiv1">
          <div class="svgHolder"> 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          ${
            !folder.new
              ? `<h2 class="articleTitle" > ${folder.name} </h2>`
              : `<input class="addNewFolderInput" newFolder="new" placeholder="Enter new folder name"/>`
          }
         
        </div>
          
      </article>`);
      });
      document.body.querySelector(".noFolderDisplayDiv")?.remove();
    }
  }
};

const createNewFolderButton = (div: HTMLElement): void => {
  div.innerHTML += `
  <div class="noFolderDisplayDiv"> 
    <button class="createNewFolderBtn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
    Create new folder </button> 
  </div>
  `;
};

export const renderTotalNumberOfUserProjects = (): void => {
  const projectLengthElement = document.querySelector(
    ".sidebarNotesLength"
  ) as HTMLElement;
  const userProjectsLength = userProjects.projects.length;

  projectLengthElement.textContent = `${userProjectsLength} projects`;
};

const createSidebar = (
  noteEditorVisible: string | number | boolean,
  todoOrNoteElement: HTMLElement,
  todoListVisible: boolean,
  homeVisible: boolean
): void => {
  let div = document.createElement("div");
  div.id = "sidebar-container";
  if (noteEditorVisible) document.body.insertBefore(div, todoOrNoteElement);
  else if (homeVisible) document.body.insertBefore(div, todoOrNoteElement);
  else if (todoListVisible) document.body.insertBefore(div, todoOrNoteElement);
  else document.body.appendChild(div);
  document.getElementById("sidebar-container")?.appendChild(generateSidebar());
};

export const sidebarEventListeners = (): void => {
  const addFolder = document.querySelector(".addFolderSvg") as HTMLElement;

  addFolder.addEventListener("click", (e: Event): void => {
    createNewFolderLogic(e);
  });
};

export const createNewFolderLogic = (e: Event) => {
  e.stopPropagation();
  folderObject.setSelectedFolder({
    name: "",
    dateCreated: "",
    content: [],
    notes: [],
    type: "",
    depth: 0,
    _id: "",
    frontendId: "",
  });
  projectStore.set("createMainFolder", true);
  projectStore.set("createNewFolder", true);
};
