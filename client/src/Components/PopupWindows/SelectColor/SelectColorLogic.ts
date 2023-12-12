import globalStore from "../../../Stores/GlobalStore";
import { noteObjectChanges, noteStore } from "../../../Stores/NoteStore";
import { SelectedText } from "../../../Utils/TsTypes";
import { applyNoteTextEdits } from "../../NoteEditor/NoteEditorLogic";
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
  globalStore.set("selectColorVisible", false);
  noteObjectChanges.pushEdit({
    option: {
      color: color,
      fontSize: "",
    },
    startIndex: selectedText.startIndex,
    endIndex: selectedText.endIndex,
  });
  applyNoteTextEdits();
};
