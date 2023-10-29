import { fullDate } from "../../Utils/Date";
import { noteTextInput } from "./NoteEditorLogic";

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
    <textarea  class="newNoteInputText" placeholder="Start your note here"> </textarea>
  </div>
  `;

  return noteEditor;
};

class Note {
  noteTitle: string;
  fetchedNoteTitle: string;
  dateCreated: string;
  noteText: string;
  fetchedNoteText: string;
  id: string;

  constructor(
    noteTitle: string,
    fetchedNoteTitle: string,
    dateCreated: string,
    noteText: string,
    fetchedNoteText: string,
    id: string
  ) {
    (this.noteTitle = noteTitle),
      (this.fetchedNoteTitle = fetchedNoteTitle),
      (this.dateCreated = dateCreated),
      (this.noteText = noteText);
    this.fetchedNoteText = fetchedNoteText;
    this.id = id;
  }

  setNoteTitle(noteTitle: string) {
    this.noteTitle = noteTitle;
  }

  setNoteText(noteText: string) {
    this.noteText = noteText;
  }

  setNote(
    noteTitle: string,
    fetchedNoteTitle: string,
    dateCreated: string,
    noteText: string,
    fetchedNoteText: string,
    id: string
  ) {
    this.noteTitle = noteTitle;
    (this.fetchedNoteTitle = fetchedNoteTitle),
      (this.dateCreated = dateCreated);
    this.noteText = noteText;
    this.fetchedNoteText = fetchedNoteText;
    this.id = id;
  }
}

export const defaultNote = new Note(
  "New Note",
  "New Note",
  fullDate,
  "",
  "",
  ""
);
