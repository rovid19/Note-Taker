import globalStore from "../../Stores/GlobalStore";
import noteService from "../../Services/NoteService";
import { generateSidebar } from "./Sidebar";
import { navigateTo } from "../../Utils/Router";
import { autoSaveNote } from "../NoteEditor/NoteEditorLogic";
import { defaultNote } from "../NoteEditor/NoteEditor";

export interface Note {
  title: string;
  noteText: string;
  dateCreated: string;
}

type UserNotes = {
  [key: string]: string;
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
    createAllNotesContainer();
    sidebarNavigationLogic();
  } else {
    document.getElementById("sidebar-container")?.remove();
  }
};

export const sidebarNavigationLogic = (): void => {
  const closeSidebarSvg = document.querySelector(".sidebarSvg") as HTMLElement;

  closeSidebarSvg.addEventListener("click", () =>
    //ovo je zapravo toggleSidebar funckija jer ne zelim poduplati event listener
    globalStore.set("sidebarVisible", !globalStore.state.sidebarVisible)
  );
};

export const createAllNotesContainer = (): void => {
  const userNotes = globalStore.get("userNotes") as unknown as Note[];
  const div = document.createElement("div");
  div.className = "sidebarDiv2";
  const sidebarStyles = document.querySelector(".sidebarStyles") as HTMLElement;
  userNotes.map((note) => {
    return (div.innerHTML += `
      <article class="sidebarArticle">
     
      <svg class="articleSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20">
    <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
  </svg>
  
      <div class="articleInnerDiv1">
      <h2 class="articleTitle" > ${note.title} </h2>
      </div>
      <div class="articleInnerDiv2">
      <h4> ${note.noteText} </h4>
      </div>
      <div class="articleInnerDiv3">
      <h6> ${note.dateCreated} </h6>
      </div>
      </article>`);
  });

  sidebarStyles.appendChild(div);
  const sidebarDiv2 = document.querySelector(".sidebarDiv2") as HTMLElement;

  eventDelegationForNotes(sidebarDiv2);
};

export const reRenderAllNotesContainer = () => {
  document.querySelector(".sidebarDiv2")?.remove();
  createAllNotesContainer();
};

export const getUserNotesLength = (): void => {
  const noteLength = globalStore.get("userNotes").length;
  globalStore.set("notesLength", noteLength);
};

export const reRenderNotesLengthElement = (): void => {
  const noteLengthElement = document.querySelector(
    ".sidebarNotesLength"
  ) as HTMLElement;

  noteLengthElement.textContent = `${globalStore.get(
    "notesLength"
  )} notes` as string;
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

const eventDelegationForNotes = (sidebarDiv2: HTMLElement): void => {
  sidebarDiv2?.addEventListener("click", (event: Event): void => {
    const target = event.target as SVGSVGElement;
    const parentElementOpen = target.closest(".sidebarArticle") as Element;
    const parentElementDelete = target.closest(".articleSvg");
    const allSvgs = document.querySelectorAll(".articleSvg");
    const allArticles = document.querySelectorAll(".sidebarArticle");

    if (parentElementDelete) {
      findIndexToDeleteNote(allSvgs, parentElementDelete);
    } else {
      console.log(defaultNote);
      autoSaveNote();
      setNoteIdToOpenNote(allArticles, parentElementOpen);
      const noteId = globalStore.get("noteId");
      navigateTo(`/notes?noteId=${noteId}`);
      globalStore.set("existingNote", true);
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
        globalStore.set("deleteNote", i);
      }
    });
  };

  const setNoteIdToOpenNote = (
    allArticles: NodeListOf<Element>,
    parentElement: Element
  ) => {
    const array = [...allArticles];
    const userNotes = globalStore.get("userNotes") as unknown as UserNotes[];
    array.findIndex((item, i) => {
      if (item === parentElement) {
        globalStore.set("noteId", userNotes[i]._id);
      }
    });
  };
};