import globalStore from "../../../Stores/GlobalStore";
import { noteObjectChanges, noteStore } from "../../../Stores/NoteStore";
import {
  addOneCharAtStartOrEndIndex,
  autoSaveNote,
} from "../../../Utils/GeneralFunctions";
import { SelectedText } from "../../../Utils/TsTypes";
import {
  applyNoteTextEdits,
  isEditAlreadyInside,
  returnIndexNumberArrayForEdit,
} from "../../NoteEditor/NoteEditorLogic";
import { generateSelectColor } from "./SelectColor";

export const isSelectColorVisible = () => {
  const isSelectColor = globalStore.get("selectColorVisible");
  const editorButtons = document.querySelector(".editorButtons") as HTMLElement;

  if (isSelectColor) {
    editorButtons.appendChild(generateSelectColor());
    selectColorEvents();
  } else {
    document.querySelector(".selectColor")?.remove();
  }
};

const selectColorEvents = () => {
  const selectColorDiv = document.querySelector(".selectColor");

  selectColorDiv?.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    const isGreen = target.closest(".color1");
    const isWhite = target.closest(".color2");
    const isYellow = target.closest(".color3");
    const isBlue = target.closest(".color4");
    const isRed = target.closest(".color5");

    if (isGreen) {
      setColorEdit("green");
    } else if (isWhite) {
      setColorEdit("white");
    } else if (isYellow) {
      setColorEdit("yellow");
    } else if (isBlue) {
      setColorEdit("blue");
    } else if (isRed) {
      setColorEdit("red");
    } else {
      setColorEdit("aqua");
    }
  });
};

const setColorEdit = (color: string) => {
  const selectedText = noteStore.get("selectedText") as unknown as SelectedText;
  const isEditOnThatIndex = noteObjectChanges.noteEdits.find(
    (edit) => edit.startIndex === selectedText.startIndex
  );
  if (isEditOnThatIndex) {
    if (isEditOnThatIndex.name === "enter") {
      let newText = noteObjectChanges.noteText;
      newText = addOneCharAtStartOrEndIndex(
        newText,
        " ",
        selectedText.startIndex
      );

      pushEditToNoteEditArray(color, selectedText, "onEnter");
    } else {
      pushEditToNoteEditArray(color, selectedText, "");
    }
  } else {
    pushEditToNoteEditArray(color, selectedText, "");
  }

  globalStore.set("selectColorVisible", false);
  applyNoteTextEdits();
};

const pushEditToNoteEditArray = (
  color: string,
  selectedText: SelectedText,
  purpose: string
) => {
  const indexNumberArray = returnIndexNumberArrayForEdit(selectedText);
  const edit = {
    name: "span",
    option: {
      color: color,
      fontSize: undefined,
    },
    startIndex: selectedText.startIndex,
    endIndex:
      purpose === "onEnter"
        ? (selectedText.endIndex as number) + 1
        : selectedText.endIndex,
    selected: false,
    indexArray: indexNumberArray,
  };
  const isFound = isEditAlreadyInside(edit.indexArray, edit.option);
  if (Object.keys(isFound).length > 0) {
    applyNoteTextEdits();
    autoSaveNote();
  } else {
    noteObjectChanges.pushEdit(edit);
    applyNoteTextEdits();
  }
};
