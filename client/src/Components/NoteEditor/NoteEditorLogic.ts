import globalStore from "../../Stores/GlobalStore";
import noteService from "../../Services/NoteService";
import { generateNewNote } from "./NoteEditor";
import { fullDate } from "../../Utils/Date";
import { Note, NoteEdits } from "../../Utils/TsTypes";
import { reRenderAllFolderContainer } from "../Sidebar/SidebarLogic";
import { createWarning } from "../PopupWindows/WarningMessage/WarningLogic";
import { defaultUser } from "../../Stores/UserStore";
import {
  noteObject,
  noteObjectChanges,
  noteStore,
} from "../../Stores/NoteStore";
import {
  autoSaveNote,
  generateRandomId,
  getSelectionIndex,
  replaceCharAtString,
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
    await noteService.createNewNote(
      fullDate,
      defaultUser.id,
      noteObject.parentId,
      noteObject.id
    );
    noteStore.set("isNewNote", false);
  } else {
    await noteService.getNote(noteObject.id);
    renderNoteFields();
    applyNoteTextEdits();

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
  const savingNoteInProgress = noteStore.get("savingNoteInProgress");

  noteTitleElement.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLInputElement;
    noteObjectChanges.setTitle(target.value);
  });

  noteTextElement.addEventListener("input", (e: Event) => {
    if (noteTextElement.textContent)
      noteObjectChanges.setText(noteTextElement.textContent);
  });

  noteTextElement.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      getSelectionIndex("enter");
      const selectionIndex = noteStore.get(
        "selectedText"
      ) as unknown as NoteEdits;
      noteObjectChanges.pushEdit(selectionIndex);
      console.log(noteObjectChanges.noteEdits, noteObject.noteEdits);
      applyNoteTextEdits();
    }
  });

  window.addEventListener("click", async (e: Event) => {
    const selectedFolderElement = projectStore.get(
      "selectedFolderElement"
    ) as HTMLElement;
    let autoSaveDone = false;
    console.log("kliknuto");
    if (noteObject.title !== noteObjectChanges.title) {
      console.log(autoSaveDone);
      noteObject.setTitle(noteObjectChanges.title);
      userProjects.saveNewFolderItem(noteObjectChanges.parentId, "note");
      closeSelectedFolder(selectedFolderElement);
      openSelectedFolder(selectedFolderElement);
      await autoSaveNote();
      autoSaveDone = true;
    }

    if (noteObject.noteText !== noteObjectChanges.noteText) {
      console.log(autoSaveDone);
      if (!autoSaveDone) {
        await autoSaveNote();
        autoSaveDone = true;
        noteObject.setText(noteObjectChanges.noteText);
      }
    }
    if (noteObject.noteEdits.length !== noteObjectChanges.noteEdits.length) {
      console.log(autoSaveDone);
      if (!autoSaveDone) {
        await autoSaveNote();
        autoSaveDone = true;
        noteObject.setNoteEdit([...noteObjectChanges.noteEdits]);
      }
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
      getSelectionIndex("getSelectionIndex");
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

  noteObject.setNote("New Note", "", generateRandomId(20), folderParentId, []);
  noteObjectChanges.setNote(
    noteObject.title,
    noteObject.noteText,
    noteObject.id,
    noteObject.parentId,
    []
  );
  noteStore.set("isNewNote", true);
  router.navigateTo(`/projects/notes?noteId=${noteObject.id}`);
  if (noteEditor) {
    document.getElementById("note-container")?.remove();
    isNoteEditorVisible();
  }
};

export const applyNoteTextEdits = () => {
  const noteText = document.querySelector(".newNoteInputText") as HTMLElement;
  let newText = noteObjectChanges.noteText;
  const array = sortNoteEditsArrayFromHighestIndexToLowest(
    noteObjectChanges.noteEdits
  );

  array.forEach((edit, i) => {
    const extractedValue = extractNoteEditValueAtIndex(
      newText,
      edit.startIndex,
      edit.endIndex
    );

    const span = setSpanElementAccordingToNoteEdit(extractedValue, edit);

    newText = replaceCharAtString(
      newText,
      span,
      edit.startIndex,
      edit.endIndex
    );
  });
  noteText.innerHTML = newText;
};

const extractNoteEditValueAtIndex = (
  noteText: string,
  start: number,
  end: number
): string => {
  let value = "";
  value = noteText.slice(start, end);
  return value;
};

const sortNoteEditsArrayFromHighestIndexToLowest = (
  arr: NoteEdits[]
): NoteEdits[] => {
  const sortedArray = arr.sort((a, b) => b.startIndex - a.startIndex);
  return sortedArray;
};

const setSpanElementAccordingToNoteEdit = (
  extractedValue: string,
  edit: NoteEdits
): string => {
  let span = "";
  if (edit.option) {
    span = `<span style="color: ${
      edit.option.color ? edit.option.color : ""
    }">${extractedValue}</span>`;
  } else {
    span = "<br></br>";
  }

  return span;
};
