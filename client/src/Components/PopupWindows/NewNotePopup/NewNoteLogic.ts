import globalStore from "../../../Stores/GlobalStore";
import { generateNewNotePopup } from "./NewNote";

export const isNewNotePopupVisible = (): void => {
  const newNotePopupVisible = globalStore.get("newNotePopupVisible");

  if (newNotePopupVisible) {
    createNewNotePopup();
  } else {
    document.querySelector(".newNoteStyles")?.remove();
  }
};

const createNewNotePopup = (): void => {
  document.body.appendChild(generateNewNotePopup());
};
