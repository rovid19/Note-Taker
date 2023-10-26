import globalStore from "../../Stores/GlobalStore";
import noteService from "../../Services/NoteService";
import { generateNewNote } from "./NoteEditor";
import { getUserNotesLength } from "../Sidebar/SidebarLogic";
import { fullDate } from "../../Utils/Date";

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

const isNewNoteOrExistingNote = (): void => {};

export const toggleNoteEditor = (liItem: HTMLElement): void => {
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

const gatherNoteIdFromUrl = () => {
  const url = window.location.pathname;
  const noteIdfromUrl = url.slice(7, url.length);
  globalStore.set("noteId", noteIdfromUrl);
};

export const deleteNote = async () => {
  const noteId = globalStore.get("deleteNote") as number;
  if (noteId !== -1) {
    await noteService.deleteNote(noteId);
    await noteService.fetchAllUserNotes();
    getUserNotesLength();
    globalStore.set("deleteNote", -1);
  }
};
