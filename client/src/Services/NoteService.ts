import { defaultNote } from "../Components/NoteEditor/NoteEditor";
import Base from "../Services/BaseService";
import globalStore from "../Stores/GlobalStore";
import { navigateTo } from "../Utils/Router";

class NoteService extends Base {
  constructor() {
    super("http://localhost:3000/api/notes");
  }
  async createNewNote(fullDate: string) {
    const newNote = await this.post("/create-new-note", { fullDate });
    defaultNote.setNote(
      newNote.title,
      newNote.title,
      newNote.dateCreated,
      newNote.noteText,
      newNote.noteText,
      newNote._id
    );
    navigateTo(`/notes?noteId=${defaultNote.id}`);
  }
  async saveNewNoteTitle(noteTitle: string | number | boolean, noteId: string) {
    await this.put("/save-note-title", {
      noteTitle,
      noteId,
    });
  }
  async fetchAllUserNotes() {
    const allNotes = await this.get("/fetch-user-notes", {});
    globalStore.set("userNotes", allNotes);
  }

  async deleteNote(noteId: string) {
    await this.delete("/delete-note", { noteId });
  }

  async getNote() {
    let params = new URLSearchParams(window.location.search);
    const noteId = params.get("noteId") as string;
    const note = await this.get("/get-specific-note", { noteId });
    defaultNote.setNote(
      note.title,
      note.title,
      note.dateCreated,
      note.noteText,
      note.noteText,
      note._id
    );
  }

  async autoSaveNote(noteId: string, noteTitle: string, noteText: string) {
    const note = await this.put("/auto-save-note", {
      noteId,
      noteTitle,
      noteText,
    });
    defaultNote.setNote(
      note.title,
      note.title,
      note.dateCreated,
      note.noteText,
      note.noteText,
      note._id
    );
  }
}

export default new NoteService();
