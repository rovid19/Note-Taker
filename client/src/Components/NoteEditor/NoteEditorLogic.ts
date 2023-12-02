import globalStore from "../../Stores/GlobalStore";
import noteService from "../../Services/NoteService";
import { generateNewNote } from "./NoteEditor";
import { fullDate } from "../../Utils/Date";
import { Note } from "../../Utils/TsTypes";
import { reRenderAllFolderContainer } from "../Sidebar/SidebarLogic";
import { createWarning } from "../PopupWindows/WarningMessage/WarningLogic";
import { defaultUser } from "../../Stores/UserStore";
import {
  noteObject,
  noteObjectChanges,
  noteStore,
} from "../../Stores/NoteStore";
import { generateRandomId } from "../../Utils/GeneralFunctions";
import { router } from "../../Utils/Router/Router";
import { projectStore, userProjects } from "../../Stores/ProjectStore";
import {
  closeSelectedFolder,
  openSelectedFolder,
} from "../Sidebar/SidebarFolderLogic";

type NoteArray = {
  _id: string;
  [key: string]: string;
};

export const isNoteEditorVisible = async () => {
  const noteEditorVisible = globalStore.get("noteEditorVisible");
  const existingNote = noteStore.get("existingNote") as unknown as Note;

  if (noteEditorVisible) {
    createNoteEditor();
    isNewNoteOrExistingNote(existingNote);
  } else {
    document.getElementById("note-container")?.remove();
  }
};

export const openSelectedNote = async (noteId: string) => {};

const createNoteEditor = (): void => {
  let div = document.createElement("div");
  div.id = "note-container";
  document.body.appendChild(div);
  document.getElementById("note-container")?.appendChild(generateNewNote());

  noteEventListeners();
};

const isNewNoteOrExistingNote = async (existingNote: Note) => {
  const sidebarVisible = globalStore.get("sidebarVisible") as boolean;
  if (existingNote) {
    renderNoteFields();
  } else {
    await noteService.createNewNote(
      fullDate,
      defaultUser.id,
      noteObject.parentId,
      noteObject.id
    );
    if (sidebarVisible) reRenderAllFolderContainer();
  }
};

const noteEventListeners = () => {
  const noteTitleElement = document.querySelector(
    ".newNoteInput"
  ) as HTMLElement;
  const noteTextElement = document.querySelector(
    ".newNoteInputText"
  ) as HTMLElement;

  noteTitleElement.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLInputElement;
    noteObjectChanges.setTitle(target.value);
    console.log(noteObjectChanges.title);
  });

  noteTextElement.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLInputElement;
    noteObjectChanges.setText(target.value);
    console.log(noteObjectChanges.noteText);
  });

  window.addEventListener("click", (e: Event): void => {
    const selectedFolderElement = projectStore.get(
      "selectedFolderElement"
    ) as HTMLElement;
    const parent = selectedFolderElement.parentNode?.parentNode as HTMLElement;
    console.log(parent);
    if (noteObject.title !== noteObjectChanges.title) {
      noteObject.setTitle(noteObjectChanges.title);
      userProjects.saveNewFolderItem(noteObjectChanges.parentId, "note");
      closeSelectedFolder(parent);
      openSelectedFolder(parent);
      noteService.autoSaveNote(
        noteObjectChanges.id,
        noteObjectChanges.title,
        noteObjectChanges.noteText
      );
    }

    if (noteObject.noteText !== noteObjectChanges.noteText) {
      noteObject.setText(noteObjectChanges.noteText);
      noteService.autoSaveNote(
        noteObjectChanges.id,
        noteObjectChanges.title,
        noteObjectChanges.noteText
      );
    }
  });
};

const renderNoteFields = () => {
  const noteTitleElement = document.querySelector(
    ".newNoteInput"
  ) as HTMLElement;
  const noteTextElement = document.querySelector(
    ".newNoteInputText"
  ) as HTMLElement;

  noteTitleElement.textContent = noteObject.title;
};

export const fetchSelectedNoteAndNavigateToIt = async (
  sidebarVisible: boolean
) => {
  await noteService.getNote(noteObject.id);
  if (sidebarVisible) router.navigateTo(`/projects/notes/${noteObject.id}`);
  else router.navigateTo(`/notes/${noteObject.id}`);
};

/*const saveTitleAfterClickingOnNoteText = (
  noteTextElement: HTMLElement,
  oldNoteTitle: string
) => {
  noteTextElement.addEventListener("click", async () => {
    const newNoteTitle = defaultNote.noteTitle;
    if (oldNoteTitle !== newNoteTitle) {
      await noteService.saveNewNoteTitle(newNoteTitle, defaultNote.id);
      await noteService.fetchAllUserNotes(defaultUser.id);
      reRenderAllFolderContainer();
      oldNoteTitle = newNoteTitle;
    }
  });
};
*/
export const deleteNote = async () => {
  const noteIndex = noteStore.get("deleteNote") as number;
  const noteId = noteStore.get("noteId") as string;

  if (noteIndex !== -1) {
    await noteService.deleteNote(noteId);
    await noteService.fetchAllUserNotes(defaultUser.id);
    reRenderAllFolderContainer();
    noteStore.set("deleteNote", -1);
  }
};

export const findNoteIdToDeleteNote = (): void => {
  const allNotes = noteStore.get("userNotes") as unknown as NoteArray[];
  const noteIndex = noteStore.get("deleteNote") as number;
  if (noteIndex !== -1) {
    noteStore.set("noteId", allNotes[noteIndex]._id);
    isNoteBeingDeletedOpen();
  }
};

/*export const fetchExistingNote = async () => {
  const existingNote = globalStore.get("existingNote");
  if (existingNote) {
    await noteService.getNote();
    noteStore.set("existingNote", false);
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
    reRenderAllFolderContainer();
  }
};

export const noteTextInput = (): void => {
  const noteText = document.querySelector(".newNoteInputText") as HTMLElement;

  noteText.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLInputElement;
    defaultNote.setNoteText(target.value);
  });
};*/

const isNoteBeingDeletedOpen = () => {
  const params = new URLSearchParams(window.location.search);
  const currentNoteId = params.get("noteId");
  const deletingNoteId = noteStore.get("noteId");

  if (currentNoteId === deletingNoteId) {
    createWarning(
      `Note you're currently trying to delete is open. Do you wish to continue?`
    );
    //globalStore.set("warningMessage", true);
  } else {
    deleteNote();
  }
};

export const createNewNote = (folderParentId: string) => {
  noteObject.setNote("New Note", "", generateRandomId(20), folderParentId);
  noteObjectChanges.setNote(
    noteObject.title,
    noteObject.noteText,
    noteObject.id,
    noteObject.parentId
  );

  globalStore.set("noteEditorVisible", true);
};
