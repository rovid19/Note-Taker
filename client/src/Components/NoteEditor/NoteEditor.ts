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
  <div class="newNoteDiv1"> 
  <div class="newNoteDiv1InnerDiv1"></div> 
  <div class="newNoteDiv1InnerDiv2"></div> 
</div>
  <div class="newNoteDiv2">
    <input class="newNoteInput" placeholder="${defaultNote.noteTitle}"/>
    ${textareaMarkup}
  </div>
  `;

  return noteEditor;
};

class Note {
  noteTitle: string;
  dateCreated: string;
  noteText: string;

  constructor(noteTitle: string, dateCreated: string, noteText: string) {
    (this.noteTitle = noteTitle),
      (this.dateCreated = dateCreated),
      (this.noteText = noteText);
  }

  setNoteTitle(noteTitle: string) {
    this.noteTitle = noteTitle;
  }

  setNoteText(noteText: string) {
    this.noteText = noteText;
  }

  setExistingNote(noteTitle: string, dateCreated: string, noteText: string) {
    this.noteTitle = noteTitle;
    this.dateCreated = dateCreated;
    this.noteText = noteText;
  }
}

export const defaultNote = new Note("New Note", fullDate, "");

const textareaMarkup = defaultNote.noteText
  ? `<textarea class="newNoteInputText"placeholder="Start your note here> ${defaultNote.noteText} </textarea>`
  : `<textarea class="newNoteInputText" placeholder="Start your note here"> </textarea>`;
