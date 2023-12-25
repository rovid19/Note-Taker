import globalStore from "../../Stores/GlobalStore";
import noteService from "../../Services/NoteService";
import { generateNewNote } from "./NoteEditor";
import { fullDate } from "../../Utils/Date";
import {
  EnterEdit,
  Note,
  NoteEdits,
  Option,
  SelectedText,
} from "../../Utils/TsTypes";
import { defaultUser } from "../../Stores/UserStore";
import {
  noteObject,
  noteObjectChanges,
  noteStore,
} from "../../Stores/NoteStore";
import {
  addOneCharAtStartOrEndIndex,
  arrayIncludes,
  arrayIncludesAll,
  autoSaveNote,
  generateRandomId,
  getSelectionIndex,
  ifNoteEditorActiveExtractNoteIdFromUrl,
  setNoteEditIndexesAccordingToNoteTextInput,
} from "../../Utils/GeneralFunctions";
import { router } from "../../Utils/Router/Router";
import { projectStore, userProjects } from "../../Stores/ProjectStore";
import {
  closeSelectedFolder,
  openSelectedFolder,
} from "../Sidebar/SidebarFolderLogic";

export const isNoteEditorVisible = async () => {
  const noteEditorVisible = globalStore.get("noteEditorVisible");
  const isNewNote = noteStore.get("isNewNote") as unknown as Note;
  if (noteEditorVisible) {
    createNoteEditor();
    isNewNoteOrExistingNote(isNewNote);
    attachEventListenerToNoteEditor();
    ifNoteEditorActiveExtractNoteIdFromUrl();
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
    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowUp"
    ) {
      e.preventDefault();
    } else if (e.key === "Backspace") {
      const backspaceCount = noteStore.get("backspaceCount") as number;
      noteStore.set("backspaceCount", backspaceCount + 1);
      removeNoteEditsOnCurrentIndex();
    } else {
      if (noteObject.noteText.length > 0) {
        setNoteEditIndexesAccordingToNoteTextInput(e);
      }
    }
  });

  noteTextElement.addEventListener("input", () => {
    if (noteTextElement.textContent)
      noteObjectChanges.setText(noteTextElement.textContent);
  });

  noteTextElement.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      getSelectionIndex("enter");
      document.execCommand("insertText", false, "\u200B");
      const enterIndex = noteStore.get("enterIndex") as unknown as EnterEdit;

      noteObjectChanges.pushEdit({
        startIndex: enterIndex.startIndex,
        name: "enter",
        selected: false,
      });
    }
  });

  window.addEventListener("click", async () => {
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
  applyNoteTextEdits();
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
    router.navigateTo("/projects/home");
    noteStore.set("noteIdFromUrl", null);
  } else {
    globalStore.set("noteEditorVisible", true);
    await noteService.getNote(noteObject.id);
    if (sidebarVisible)
      router.navigateTo(`/projects/notes?noteId=${noteObject.id}`);
    else router.navigateTo(`/notes?noteId=${noteObject.id}`);
    renderNoteFields();
    ifNoteEditorActiveExtractNoteIdFromUrl();
  }
};

const noteEditorButtonsEventListener = () => {
  const noteEditorButtons = document.querySelector(
    ".editorButtons"
  ) as HTMLElement;

  noteEditorButtons.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    const isReading = target.closest(".removeStylingBtn");
    const isColor = target.closest(".color");
    const isFontSizeUp = target.closest(".fontSizeUp");
    const isFontSizeDown = target.closest(".fontSizeDown");

    if (isReading) {
      getSelectionIndex("");
      const selection = noteStore.get("selectedText") as unknown as NoteEdits;
      removeStylingFromSelection(selection);
    } else if (isColor) {
      const selectColorVisible = globalStore.get("selectColorVisible");
      getSelectionIndex("getSelectionIndex");
      globalStore.set("selectColorVisible", !selectColorVisible);
    } else if (isFontSizeUp) {
      setFontSizeEditToASelection("up");
    } else if (isFontSizeDown) {
      setFontSizeEditToASelection("down");
    }
  });
};

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
  const array = sortNoteEditsArrayFromHighestIndexToLowest(
    noteObjectChanges.noteEdits
  );
  let newText = noteObjectChanges.noteText;
  array.forEach((edit) => {
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

  let textArray = newText.split("") as string[];

  textArray.forEach((char, i) => {
    if (char === "˛") {
      textArray[i] = "</br>";
    } else if (char === "~") {
      const index = howManyHtmlTagsAreBeforeSpanTag(textArray.slice(0, i));
      const foundEdit = findEditAndReturnIt(i - index) as unknown as NoteEdits;
      let style = "";
      if (foundEdit.option && foundEdit.option.color) {
        style += `color: ${foundEdit.option.color};`;
      }
      if (foundEdit.option && foundEdit.option.fontSize) {
        style += ` font-size: ${foundEdit.option.fontSize * 8}px; `;
      }
      textArray[i] = `<span style='${style}' >`;
    } else if (char === "¸") {
      textArray[i] = "</span>";
    }
  });

  const joinedText = textArray.join("");
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

const sortNoteEditsArrayFromHighestIndexToLowest = (
  arr: NoteEdits[]
): NoteEdits[] => {
  const sortedArray = arr.sort((a, b) => b.startIndex - a.startIndex);
  return sortedArray;
};

export const changeNoteEditIndexesAccordingly = () => {
  if (noteObjectChanges.noteText.length > 0) {
    const currentCaretIndex = noteStore.get("currentTextIndex") as number;
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

const setFontSizeEditToASelection = (purpose: string) => {
  if (purpose === "up") noteStore.set("fontSize", "up");
  else noteStore.set("fontSize", "down");
  getSelectionIndex("getSelectionIndex");
  const selection = noteStore.get("selectedText") as unknown as NoteEdits;
  const indexNumberArray = returnIndexNumberArrayForEdit(selection);
  const editObject = {
    name: "span",
    option: { color: "", fontSize: 3 },
    startIndex: selection.startIndex,
    endIndex: selection.endIndex,
    indexArray: [...indexNumberArray],
    selected: false,
  };
  const isFound = isEditAlreadyInside(indexNumberArray, editObject.option);
  const editFontSize = noteStore.get("editFontSize");
  if (editFontSize) {
    editObject.option.fontSize =
      purpose === "up"
        ? editObject.option.fontSize + 1
        : editObject.option.fontSize - 1;
  }

  if (Object.keys(isFound).length > 0) {
    applyNoteTextEdits();
    autoSaveNote();
  } else {
    noteObjectChanges.pushEdit(editObject);
    applyNoteTextEdits();
  }
  noteStore.set("editFontSize", null);
};

export const isEditAlreadyInside = (
  indexNumberArray: number[],
  newEditOption: Option
) => {
  let foundAndModifiedEdit = {} as NoteEdits;
  noteObjectChanges.noteEdits.forEach((edit: NoteEdits) => {
    if (edit.indexArray) {
      let value = arrayIncludesAll(
        edit.indexArray as number[],
        indexNumberArray
      );
      if (value) {
        ifArrayIncludesAllIndexs(edit, newEditOption, foundAndModifiedEdit);
      } else {
        let value = arrayIncludes(
          edit.indexArray as number[],
          indexNumberArray
        );
        if (value) {
          if (edit.option?.fontSize) {
            noteStore.set("editFontSize", edit.option.fontSize);
          }
        }
      }
    }
  });

  return foundAndModifiedEdit;
};

const ifArrayIncludesAllIndexs = (
  edit: NoteEdits,
  newEditOption: Option,
  foundAndModifiedEdit: NoteEdits
) => {
  if (edit.option) {
    if (newEditOption.color) {
      edit.option.color = newEditOption.color;
    }
  }
  if (edit.option?.fontSize && newEditOption.fontSize) {
    const fontSize = noteStore.get("fontSize");
    if (fontSize === "up") edit.option.fontSize = edit.option.fontSize + 1;
    else {
      edit.option.fontSize =
        edit.option.fontSize === 2 ? 2 : edit.option.fontSize - 1;
    }
  } else if (newEditOption.fontSize) {
    if (edit.option) {
      edit.option.fontSize = newEditOption.fontSize;
    }
  }
  Object.assign(foundAndModifiedEdit, edit);
};

export const returnIndexNumberArrayForEdit = (
  selection: SelectedText
): number[] => {
  let selectionIndexArray = new Array(
    (selection.endIndex as number) - selection.startIndex + 1
  ).fill(0);
  selectionIndexArray.forEach((_, i) => {
    selectionIndexArray[i] = selection.startIndex + i;
  });

  return selectionIndexArray;
};

const removeStylingFromSelection = (selection: SelectedText) => {
  const selectionIndexArray = returnIndexNumberArrayForEdit(selection);

  noteObjectChanges.noteEdits.forEach((edit) => {
    if (edit.indexArray) {
      const doesEditArrayIncludesSelectionArrayNumber = arrayIncludes(
        edit.indexArray as number[],
        selectionIndexArray
      );
      if (doesEditArrayIncludesSelectionArrayNumber) {
        edit.selected = true;
        const newEditArray = noteObjectChanges.noteEdits.filter(
          (edit) => edit.selected !== true
        );
        noteObjectChanges.setNoteEdit(newEditArray);
        applyNoteTextEdits();
      }
    }
  });
};

const removeNoteEditsOnCurrentIndex = () => {
  const currentCursorIndex = noteStore.get("currentTextIndex") as number;
  const backspaceCount = noteStore.get("backspaceCount") as number;
  const deleteIndex = currentCursorIndex - backspaceCount;

  noteObjectChanges.noteEdits.forEach((edit) => {
    if (edit.name === "enter") {
      if (edit.startIndex === deleteIndex) {
        edit.selected = true;
      }
    } else {
      const value = arrayIncludes(edit.indexArray as number[], deleteIndex);
      if (value) {
        edit.selected = true;
      }
    }
  });
  const array = noteObjectChanges.noteEdits.filter(
    (edit) => edit.selected !== true
  );

  noteObjectChanges.setNoteEdit(array);
};
