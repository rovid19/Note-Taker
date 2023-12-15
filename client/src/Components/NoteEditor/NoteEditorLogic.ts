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
  add1ToEveryIndexStartingAfterSelectionStartIndex,
  addOneCharAtStartOrEndIndex,
  addWhiteSpaceForEveryEnter,
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
    attachEventListenerToNoteEditor();
  } else {
    document.getElementById("note-container")?.remove();
  }
};

const createNoteEditor = (): void => {
  let div = document.createElement("div");
  div.id = "note-container";
  document.body.appendChild(div);
  document.getElementById("note-container")?.appendChild(generateNewNote());
};

const attachEventListenerToNoteEditor = () => {
  /*
  const noteEditor = document.querySelector("#note-container") as HTMLElement;
  const config = { childList: true };
  const observer = new MutationObserver((mutationList) => {
    for (let mutation of mutationList) {
      if (mutation.type === "childList") {
  
      }
    }
  });
  observer.observe(noteEditor, config);
*/
  setTimeout(() => {
    noteEventListeners();
    noteEditorButtonsEventListener();
  }, 500);
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

  noteTitleElement.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLInputElement;
    noteObjectChanges.setTitle(target.value);
  });

  noteTextElement.addEventListener("keydown", (e: KeyboardEvent) => {
    noteStore.push("addedText", e.key);
    changeNoteEditIndexesAccordingly();
  });

  noteTextElement.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLDivElement;
    if (noteTextElement.textContent)
      noteObjectChanges.setText(noteTextElement.textContent);
    //noteStore.set("addedText", target.value);
  });

  noteTextElement.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      document.execCommand("insertText", false, "\u200B");
      getSelectionIndex("enter");
      const selectionIndex = noteStore.get(
        "selectedText"
      ) as unknown as NoteEdits;

      noteObjectChanges.pushEdit({ ...selectionIndex, name: "enter" });
    }
  });

  window.addEventListener("click", async (e: Event) => {
    const selectedFolderElement = projectStore.get(
      "selectedFolderElement"
    ) as HTMLElement;
    let autoSaveDone = false;
    const savingNoteInProgress = noteStore.get("savingNoteInProgress");

    getSelectionIndex("onClick");
    if (!savingNoteInProgress) {
      if (noteObject.title !== noteObjectChanges.title) {
        noteObject.setTitle(noteObjectChanges.title);
        userProjects.saveNewFolderItem(noteObjectChanges.parentId, "note");
        closeSelectedFolder(selectedFolderElement);
        openSelectedFolder(selectedFolderElement);
        await autoSaveNote();
        autoSaveDone = true;
      }

      if (noteObject.noteText !== noteObjectChanges.noteText) {
        if (!autoSaveDone) {
          await autoSaveNote();
          autoSaveDone = true;
          noteObject.setText(noteObjectChanges.noteText);
        }
      }
      if (noteObject.noteEdits.length !== noteObjectChanges.noteEdits.length) {
        if (!autoSaveDone) {
          await autoSaveNote();
          autoSaveDone = true;
          noteObject.setNoteEdit([...noteObjectChanges.noteEdits]);
        }
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
    globalStore.set("noteEditorVisible", true);
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
  console.log("da");
  const noteText = document.querySelector(".newNoteInputText") as HTMLElement;
  const array = sortNoteEditsArrayFromHighestIndexToLowest(
    noteObjectChanges.noteEdits
  );

  let newText = noteObjectChanges.noteText;
  array.forEach((edit, i) => {
    if (edit.name === "enter") {
      newText = addOneCharAtStartOrEndIndex(newText, "˛", edit.startIndex);
    } else if (edit.name === "span") {
      newText = addOneCharAtStartOrEndIndex(newText, "~", edit.startIndex);
      newText = addOneCharAtStartOrEndIndex(
        newText,
        "¸",
        (edit.endIndex as number) + 1
      );
    }
  });
  console.log(newText);

  /*const appliedBreakElementsText = applyNoteBreakElements(noteText);
  noteText.innerHTML = appliedBreakElementsText;
  let newText = noteText.textContent as string;
  array.forEach((edit, i) => {
    if (edit) {
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
    }
  });*/
  let textArray = newText.split("") as string[];

  textArray.forEach((char, i) => {
    if (char === "˛") {
      textArray[i] = "</br>";
    } else if (char === "~") {
      const index = howManyHtmlTagsAreBeforeSpanTag(textArray.slice(0, i));
      const foundEdit = findEditAndReturnIt(i - index) as unknown as NoteEdits;

      let style = "";
      if (foundEdit.option && foundEdit.option.color) {
        style += `color: ${foundEdit.option.color}`;
      }
      if (foundEdit.option && foundEdit.option.fontSize) {
        style += ` fontSize: ${foundEdit.option.fontSize}`;
      }
      textArray[i] = `<span style='${style}' >`;
    } else if (char === "¸") {
      textArray[i] = "</span>";
    }
  });
  console.log(textArray);
  const joinedText = textArray.join("");
  console.log(joinedText);
  noteText.innerHTML = joinedText;
};

const findEditAndReturnIt = (startIndex: number): NoteEdits => {
  let editt = {};
  noteObjectChanges.noteEdits.forEach((edit) => {
    if (edit.startIndex === startIndex) {
      editt = edit;
    }
  });
  return editt as unknown as NoteEdits;
};

const howManyHtmlTagsAreBeforeSpanTag = (textArray: string[]): number => {
  const indexes = [];
  textArray.forEach((char) => {
    if (char.length > 1) indexes.push(0);
  });
  return indexes.length;
};

/*const applyNoteBreakElements = (noteText: HTMLElement): string => {
  let textArray = noteText.textContent?.split("");
  console.log(textArray);
  textArray?.forEach((char, i) => {
    if (char === "˛") {
      console.log(char);
      if (textArray) textArray[i] = "</br>";
    }
  });

  const arrayBackToText = textArray?.join("") as string;
  return arrayBackToText;
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
const setSpanElementAccordingToNoteEdit = (
  extractedValue: string,
  edit: NoteEdits
): string => {
  let span = "";
  if (edit.option) {
    span = `<span style="color: ${
      edit.option.color ? edit.option.color : ""
    }">${extractedValue}</span>`;
  }

  return span;
};*/

const sortNoteEditsArrayFromHighestIndexToLowest = (
  arr: NoteEdits[]
): NoteEdits[] => {
  const sortedArray = arr.sort((a, b) => b.startIndex - a.startIndex);
  return sortedArray;
};

export const changeNoteEditIndexesAccordingly = () => {
  if (noteObjectChanges.noteText.length > 0) {
    const currentCaretIndex = noteStore.get("currentTextIndex") as number;
    console.log(noteObjectChanges.noteEdits, currentCaretIndex);
    noteObjectChanges.noteEdits.forEach((edit) => {
      if (edit.startIndex >= currentCaretIndex) {
        edit.startIndex = edit.startIndex + 1;
        if (edit.endIndex) {
          edit.endIndex = edit.endIndex + 1;
        }
      }
    });
  }
};
