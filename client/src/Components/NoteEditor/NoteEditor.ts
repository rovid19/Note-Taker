import { noteObject } from "../../Stores/NoteStore";
import { fullDate } from "../../Utils/Date";

export const generateNewNote = (): HTMLElement => {
  if (!document.querySelector("noteStyling")) {
    const link = document.createElement("link");
    link.id = "noteStyling";
    link.rel = "stylesheet";
    link.href = "../../src/Components/NoteEditor/noteStyling.css";

    document.head.appendChild(link);
  }
  console.log(noteObject);
  const noteEditor = document.createElement("div");
  noteEditor.className = "newNoteStyles";
  noteEditor.innerHTML = `
  <div class="newNoteDiv1"> 
  <div class="newNoteDiv1InnerDiv1"></div> 
  <div class="newNoteDiv1InnerDiv2"></div> 
</div>
  <div class="newNoteDiv2">
    <input class="newNoteInput" placeholder="${noteObject.title}"/>
    <textarea  class="newNoteInputText" placeholder="Start your note here"> </textarea>
  </div>
  `;

  return noteEditor;
};
