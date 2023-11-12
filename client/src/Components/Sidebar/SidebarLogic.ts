import globalStore from "../../Stores/GlobalStore";
import { generateSidebar } from "./Sidebar";
import { autoSaveNote } from "../NoteEditor/NoteEditorLogic";
import { defaultUser } from "../../Stores/UserStore";
import { router } from "../../Utils/Router/Router";
import { extractProjectFromUrl } from "../../Utils/Router/RouterLogic";
import { noteStore } from "../../Stores/NoteStore";
import { projectService } from "../../Services/ProjectService";
import { defaultFolder, projectStore } from "../../Stores/ProjectStore";

export type todoItem = {
  name: string;
  isDone: boolean;
};

export type todo = {
  name: string;
  dateCreated: string;
  todoItems: todoItem[];
};

export interface Folder {
  title: string;
  dateCreated: string;
  content: Folder | todo;
}

type UserNotes = {
  [key: string]: string;
};

export const isSidebarVisible = async () => {
  const sidebarVisible = globalStore.state.sidebarVisible;
  console.log(sidebarVisible);
  const noteEditorVisible = globalStore.state.noteEditorVisible;
  const todoListVisible = globalStore.get("todoListVisible") as boolean;
  const homeVisible = globalStore.get("homeVisible") as boolean;

  const todoOrNoteElement = whichEditorIsActive(
    noteEditorVisible,
    homeVisible
  ) as HTMLElement;

  if (sidebarVisible) {
    await projectService.fetchAllUserProjects(defaultUser.id);
    createSidebar(
      noteEditorVisible,
      todoOrNoteElement,
      todoListVisible,
      homeVisible
    );
    updateUserNotesLength();
    createAllFolderContainer();
    sidebarNavigationLogic();
  } else {
    document.getElementById("sidebar-container")?.remove();
    removeUrl();
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

  closeSidebarSvg.addEventListener("click", () => {
    //ovo je zapravo toggleSidebar funckija jer ne zelim poduplati event listener
    const url = window.location.pathname.replace("/projects", "");
    router.navigateTo(url);
  });
};

export const createAllFolderContainer = (): void => {
  const div = document.createElement("div");
  div.className = "sidebarDiv2";
  const sidebarStyles = document.querySelector(".sidebarStyles") as HTMLElement;
  mapOverAllUserProjects(defaultFolder.userFolder, div);
  sidebarStyles.appendChild(div);
  const sidebarDiv2 = document.querySelector(".sidebarDiv2") as HTMLElement;

  eventDelegationForNotes(sidebarDiv2);
};

export const reRenderAllFolderContainer = () => {
  document.querySelector(".sidebarDiv2")?.remove();
  createAllFolderContainer();
};

const mapOverAllUserProjects = (
  userFolders: Folder[],
  div: HTMLElement
): void => {
  console.log(userFolders);
  if (userFolders === undefined) {
    createNewFolderButton(div);
  } else {
    console.log(userFolders);
    userFolders.map((folder) => {
      return (div.innerHTML += `
      <article class="sidebarArticle">
     
      <svg class="articleSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20">
    <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
  </svg>
  
      <div class="articleInnerDiv1">
      <h2 class="articleTitle" > ${folder.title} </h2>
      </div>
      <div class="articleInnerDiv2">
      <h4>  </h4>
      </div>
      <div class="articleInnerDiv3">
      <h6> ${folder.dateCreated} </h6>
      </div>
      </article>`);
    });
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

export const updateUserNotesLength = (): void => {
  const noteLength = (noteStore.get("userNotes") as unknown as UserNotes[])
    .length;
  noteStore.set("notesLength", noteLength);
};

export const reRenderNotesLengthElement = (): void => {
  const noteLengthElement = document.querySelector(
    ".sidebarNotesLength"
  ) as HTMLElement;

  noteLengthElement.textContent = `${globalStore.get(
    "notesLength"
  )} projects` as string;
};

const createSidebar = (
  noteEditorVisible: string | number | boolean,
  todoOrNoteElement: HTMLElement,
  todoListVisible: boolean,
  homeVisible: boolean
): void => {
  let div = document.createElement("div");
  div.id = "sidebar-container";
  // insert before noteEditor
  if (noteEditorVisible) document.body.insertBefore(div, todoOrNoteElement);
  // insert before home
  else if (homeVisible) document.body.insertBefore(div, todoOrNoteElement);
  // insert before todoList
  else if (todoListVisible) document.body.insertBefore(div, todoOrNoteElement);
  // normal insert if both aren't active
  else document.body.appendChild(div);
  document.getElementById("sidebar-container")?.appendChild(generateSidebar());
};

const eventDelegationForNotes = (sidebarDiv2: HTMLElement): void => {
  sidebarDiv2?.addEventListener("click", (event: Event): void => {
    const target = event.target as SVGSVGElement;
    const parentElementOpen = target.closest(".sidebarArticle") as Element;
    const parentElementDelete = target.closest(".articleSvg");
    const parentElementCreateNewFolder = target.closest(".createNewFolderBtn");
    const allSvgs = document.querySelectorAll(".articleSvg");
    const allArticles = document.querySelectorAll(".sidebarArticle");

    if (parentElementDelete) {
      findIndexToDeleteNote(allSvgs, parentElementDelete);
    } else if (parentElementCreateNewFolder) {
      console.log(projectStore.get("isCreateNewFolderVisible"));
      projectStore.set("isCreateNewFolderVisible", true);
      console.log(projectStore.get("isCreateNewFolderVisible"));
    } else {
      autoSaveNote();
      setNoteIdToOpenNote(allArticles, parentElementOpen);
      const noteId = noteStore.get("noteId");
      router.navigateTo(`/notes/noteId=${noteId}`);
      noteStore.set("existingNote", true);
      globalStore.set("noteEditorVisible", true);
    }
  });

  const findIndexToDeleteNote = (
    allSvgs: NodeListOf<Element>,
    parentElement: Element
  ): void => {
    const array = [...allSvgs];
    array.findIndex((item, i) => {
      if (item === parentElement) {
        noteStore.set("deleteNote", i);
      }
    });
  };

  const setNoteIdToOpenNote = (
    allArticles: NodeListOf<Element>,
    parentElement: Element
  ) => {
    const array = [...allArticles];
    const userNotes = noteStore.get("userNotes") as unknown as UserNotes[];
    array.findIndex((item, i) => {
      if (item === parentElement) {
        noteStore.set("noteId", userNotes[i]._id);
      }
    });
  };
};
