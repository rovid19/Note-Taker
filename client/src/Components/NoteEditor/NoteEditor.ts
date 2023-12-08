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
  const noteEditor = document.createElement("div");
  noteEditor.className = "newNoteStyles";
  noteEditor.innerHTML = `
  <div class="editorButtons">
  <div class="read"><h4>Reading mode:</h4>
    <button class="readBtn">
      <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="30">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    </button>
  </div>

  <div class="color">
  <h4>Color:</h4>
  <button class="colorBtn"></button>
  </div>

  <div class="fontSize">
  <h4>Font size:</h4>
  <div class="fontBtns"> 
    <button>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="30">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
    <button>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="30">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
      </svg>
    </button>
  </div>
  </div>
</div>

<div class="newNoteDiv2">
  <input class="newNoteInput" placeholder="${noteObject.title}" />
  <textarea class="newNoteInputText" placeholder="Start your note here">${
    noteObject.noteText && noteObject.noteText
  }</textarea>
</div>
  `;

  return noteEditor;
};
