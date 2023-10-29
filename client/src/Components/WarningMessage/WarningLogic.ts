import globalStore from "../../Stores/GlobalStore";
import { deleteNote } from "../NoteEditor/NoteEditorLogic";
import { generateMessage } from "./GenerateMessage";

export const createWarning = (warningMessage: string) => {
  const div = document.createElement("div") as HTMLElement;
  div.className = "warning-container";
  document.body.appendChild(div).appendChild(generateMessage(warningMessage));

  warningMessageEventListeners(div);
};

const warningMessageEventListeners = (div: Element): void => {
  const yes = document.querySelector(".warningButton1");
  const no = document.querySelector(".warningButton2");

  yes?.addEventListener("click", (): void => {
    deleteNote();
    div.remove();
    globalStore.set("deleteNote", -1);
    globalStore.set("noteEditorVisible", false);
  });

  no?.addEventListener("click", (): void => {
    div.remove();
    globalStore.set("deleteNote", -1);
  });
};
