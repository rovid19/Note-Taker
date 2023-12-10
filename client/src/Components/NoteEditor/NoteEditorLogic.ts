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
import {
  generateRandomId,
  getSelectedTextValue,
} from "../../Utils/GeneralFunctions";
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
  const isNewNote = noteStore.get("isNewNote") as unknown as Note;

  if (noteEditorVisible) {
    createNoteEditor();
    isNewNoteOrExistingNote(isNewNote);
  } else {
    document.getElementById("note-container")?.remove();
  }
};

const createNoteEditor = (): void => {
  let div = document.createElement("div");
  div.id = "note-container";
  document.body.appendChild(div);
  document.getElementById("note-container")?.appendChild(generateNewNote());

  noteEventListeners();
  noteEditorButtonsEventListener();
};

const isNewNoteOrExistingNote = async (isNewNote: Note) => {
  if (isNewNote) {
    console.log("da2");
    await noteService.createNewNote(
      fullDate,
      defaultUser.id,
      noteObject.parentId,
      noteObject.id
    );
    noteStore.set("isNewNote", false);
    console.log(isNewNote);
  } else {
    await noteService.getNote(noteObject.id);
    renderNoteFields();
    console.log(noteObjectChanges.noteText);
    //if (sidebarVisible) reRenderAllFolderContainer();
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
  });

  noteTextElement.addEventListener("input", (e: Event) => {
    noteObjectChanges.setText(noteTextElement.innerHTML);
    console.log(noteObjectChanges.noteText, noteObject.noteText);
  });

  window.addEventListener("click", (e: Event): void => {
    const selectedFolderElement = projectStore.get(
      "selectedFolderElement"
    ) as HTMLElement;

    if (noteObject.title !== noteObjectChanges.title) {
      noteObject.setTitle(noteObjectChanges.title);
      userProjects.saveNewFolderItem(noteObjectChanges.parentId, "note");
      closeSelectedFolder(selectedFolderElement);
      openSelectedFolder(selectedFolderElement);
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
  document.getElementById("note-container")?.remove();
  createNoteEditor();
};

export const fetchSelectedNoteAndNavigateToIt = async (
  sidebarVisible: boolean,
  purpose: string
) => {
  const selectedFolderElement = projectStore.get(
    "selectedFolderElement"
  ) as HTMLElement;
  const parent = selectedFolderElement.parentNode?.parentNode as HTMLElement;
  console.log(selectedFolderElement);
  if (purpose === "delete") {
    await noteService.getNote(noteObject.id);
    userProjects.deleteFolder("", noteObject);
    closeSelectedFolder(parent);
    openSelectedFolder(parent);
    noteService.deleteNote(noteObject.id, noteObjectChanges.parentId);
  } else {
    await noteService.getNote(noteObject.id);
    if (sidebarVisible)
      router.navigateTo(`/projects/notes?noteId=${noteObject.id}`);
    else router.navigateTo(`/notes?noteId=${noteObject.id}`);
    renderNoteFields();
  }
};

const noteEditorButtonsEventListener = () => {
  const noteEditorButtons = document.querySelector(
    ".editorButtons"
  ) as HTMLElement;

  noteEditorButtons.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    const isReading = target.closest(".read");
    const isColor = target.closest(".color");

    if (isReading) {
    } else if (isColor) {
      const selectColorVisible = globalStore.get("selectColorVisible");
      getSelectedTextValue();
      globalStore.set("selectColorVisible", !selectColorVisible);
    } else {
    }
  });
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

export const deleteNote = async () => {
  const noteIndex = noteStore.get("deleteNote") as number;
  const noteId = noteStore.get("noteId") as string;

  if (noteIndex !== -1) {
    await noteService.deleteNote(noteId, noteObjectChanges.parentId);
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
};*/

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
};

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
};*/

export const createNewNote = (folderParentId: string) => {
  const noteEditor = globalStore.get("noteEditorVisible");

  noteObject.setNote("New Note", "", generateRandomId(20), folderParentId);
  noteObjectChanges.setNote(
    noteObject.title,
    noteObject.noteText,
    noteObject.id,
    noteObject.parentId
  );
  noteStore.set("isNewNote", true);
  router.navigateTo(`/projects/notes?noteId=${noteObject.id}`);
  if (noteEditor) {
    document.getElementById("note-container")?.remove();
    isNoteEditorVisible();
  }
};

export const applyNoteTextEdits = () => {
  console.log("da");
  const noteText = document.querySelector(".newNoteInputText")
    ?.textContent as unknown as string;

  noteObjectChanges.noteEdits.forEach((edit) => {
    const extractedValue = extractNoteEditValueAtIndex(
      noteText,
      edit.startIndex,
      edit.endIndex
    );
    let span = `<span style="color: ${edit.option.slice(
      6,
      edit.option.length
    )}">${extractedValue}</span>`;
    console.log(span);

    noteText.slice(edit.startIndex, edit.endIndex) +
      span +
      noteText.slice(edit.startIndex);

    console.log(noteText);
  });
};

const extractNoteEditValueAtIndex = (
  noteText: string,
  start: number,
  end: number
): string => {
  let value = "";
  console.log(start, end, noteText);
  value = noteText.slice(start, end);
  return value;
};
