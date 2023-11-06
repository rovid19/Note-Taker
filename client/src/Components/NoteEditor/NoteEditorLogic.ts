import globalStore from "../../Stores/GlobalStore";
import noteService from "../../Services/NoteService";
import { defaultNote, generateNewNote } from "./NoteEditor";
import { updateUserNotesLength } from "../Sidebar/SidebarLogic";
import { fullDate } from "../../Utils/Date";

import { reRenderAllNotesContainer } from "../Sidebar/SidebarLogic";
import { createWarning } from "../PopupWindows/WarningMessage/WarningLogic";
import { defaultUser } from "../../Stores/UserStore";
import { router } from "../../Utils/Router";

type NoteArray = {
  _id: string;
  [key: string]: string;
};

export const isNoteEditorVisible = async () => {
  const noteEditorVisible = globalStore.get("noteEditorVisible");
  const existingNote = globalStore.get("existingNote") as boolean;

  if (noteEditorVisible) {
    createNoteEditor();
    isNewNoteOrExistingNote(existingNote);
  } else {
    document.getElementById("note-container")?.remove();
  }
};

const createNoteEditor = (): void => {
  let div = document.createElement("div");
  div.id = "note-container";
  document.body.appendChild(div);
  document.getElementById("note-container")?.appendChild(generateNewNote());

  saveNewNoteTitle();
  noteTextInput();
};

const isNewNoteOrExistingNote = async (existingNote: boolean) => {
  const sidebarVisible = globalStore.get("sidebarVisible");
  if (existingNote) {
  } else {
    await noteService.createNewNote(fullDate, defaultUser.id);
    await noteService.fetchAllUserNotes(defaultUser.id);
    if (sidebarVisible) reRenderAllNotesContainer();
    reRenderNoteFields();
  }
};

const saveNewNoteTitle = (): void => {
  const noteTitleElement = document.querySelector(
    ".newNoteInput"
  ) as HTMLElement;
  const noteTextElement = document.querySelector(
    ".newNoteInputText"
  ) as HTMLElement;
  let oldNoteTitle = globalStore.get("noteTitle") as string;

  addNewNoteTitle(noteTitleElement);
  saveTitleAfterClickingOnNoteText(noteTextElement, oldNoteTitle);
};

const addNewNoteTitle = (noteTitleElement: HTMLElement) => {
  noteTitleElement.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    defaultNote.setNoteTitle(value);
  });
};

const saveTitleAfterClickingOnNoteText = (
  noteTextElement: HTMLElement,
  oldNoteTitle: string
) => {
  noteTextElement.addEventListener("click", async () => {
    const newNoteTitle = defaultNote.noteTitle;
    if (oldNoteTitle !== newNoteTitle) {
      await noteService.saveNewNoteTitle(newNoteTitle, defaultNote.id);
      await noteService.fetchAllUserNotes(defaultUser.id);
      reRenderAllNotesContainer();
      oldNoteTitle = newNoteTitle;
    }
  });
};

export const deleteNote = async () => {
  const noteIndex = globalStore.get("deleteNote") as number;
  const noteId = globalStore.get("noteId") as string;

  if (noteIndex !== -1) {
    await noteService.deleteNote(noteId);
    await noteService.fetchAllUserNotes(defaultUser.id);
    reRenderAllNotesContainer();
    updateUserNotesLength();
    globalStore.set("deleteNote", -1);
  }
};

export const findNoteIdToDeleteNote = (): void => {
  const allNotes = globalStore.get("userNotes") as unknown as NoteArray[];
  const noteIndex = globalStore.get("deleteNote") as number;
  if (noteIndex !== -1) {
    globalStore.set("noteId", allNotes[noteIndex]._id);
    isNoteBeingDeletedOpen();
  }
};

export const fetchExistingNote = async () => {
  const existingNote = globalStore.get("existingNote");
  if (existingNote) {
    await noteService.getNote();
    globalStore.set("existingNote", false);
    reRenderNoteFields();
  }
};

export const reRenderNoteFields = (): void => {
  const title = document.querySelector(".newNoteInput") as HTMLInputElement;
  const noteText = document.querySelector(
    ".newNoteInputText"
  ) as HTMLInputElement;
  title.value = defaultNote.noteTitle;
  noteText.value = defaultNote.noteText;
};

export const autoSaveNote = async () => {
  if (
    defaultNote.fetchedNoteText !== defaultNote.noteText ||
    defaultNote.fetchedNoteTitle !== defaultNote.noteTitle
  ) {
    await noteService.autoSaveNote(
      defaultNote.id,
      defaultNote.noteTitle,
      defaultNote.noteText
    );
    await noteService.fetchAllUserNotes(defaultUser.id);
    reRenderAllNotesContainer();
  }
};

export const noteTextInput = (): void => {
  const noteText = document.querySelector(".newNoteInputText") as HTMLElement;

  noteText.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLInputElement;
    defaultNote.setNoteText(target.value);
  });
};

/*export const gatherNoteIdFromUrl = () => {
  const url = window.location.pathname;
  const noteIdfromUrl = url.slice(7, url.length);
  globalStore.set("noteId", noteIdfromUrl);

  return noteIdfromUrl;
};*/

const isNoteBeingDeletedOpen = () => {
  const params = new URLSearchParams(window.location.search);
  const currentNoteId = params.get("noteId");
  const deletingNoteId = globalStore.get("noteId");

  if (currentNoteId === deletingNoteId) {
    createWarning(
      `Note you're currently trying to delete is open. Do you wish to continue?`
    );
    //globalStore.set("warningMessage", true);
  } else {
    deleteNote();
  }
};
