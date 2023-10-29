import globalStore from "../../Stores/GlobalStore";
import noteService from "../../Services/NoteService";
import { defaultNote, generateNewNote } from "./NoteEditor";
import {
  createAllNotesContainer,
  getUserNotesLength,
} from "../Sidebar/SidebarLogic";
import { fullDate } from "../../Utils/Date";
import { navigateTo } from "../../Utils/Router";
import { reRenderAllNotesContainer } from "../Sidebar/SidebarLogic";

export const isNoteEditorVisible = async () => {
  const noteEditorVisible = globalStore.get("noteEditorVisible");
  const existingNote = globalStore.get("existingNote") as boolean;

  if (noteEditorVisible) {
    createNoteEditor();
    isNewNoteOrExistingNote(existingNote);
  } else {
    navigateTo("/");
    document.getElementById("note-container")?.remove();
  }
};

const isNewNoteOrExistingNote = async (existingNote: boolean) => {
  if (existingNote) {
  } else {
    await noteService.createNewNote(fullDate);
    await noteService.fetchAllUserNotes();
    reRenderNoteFields();
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
    console.log(defaultNote.noteTitle);
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
      await noteService.fetchAllUserNotes();
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
    await noteService.fetchAllUserNotes();
    reRenderAllNotesContainer();
    getUserNotesLength();
  }
};

type NoteArray = {
  _id: string;
  [key: string]: string;
};

export const setNoteIdToDeleteNote = (): void => {
  const allNotes = globalStore.get("userNotes") as unknown as NoteArray[];
  const noteIndex = globalStore.get("deleteNote") as number;
  globalStore.set("noteId", allNotes[noteIndex]._id);
  deleteNote();
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
    await noteService.fetchAllUserNotes();
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

export const gatherNoteIdFromUrl = () => {
  const url = window.location.pathname;
  const noteIdfromUrl = url.slice(7, url.length);
  globalStore.set("noteId", noteIdfromUrl);

  return noteIdfromUrl;
};
