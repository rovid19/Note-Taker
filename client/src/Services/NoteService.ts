import Base from "./BaseService";
import globalStore from "../Stores/GlobalStore";
import { noteObject, noteObjectChanges } from "../Stores/NoteStore";

class ProjectService extends Base {
  constructor() {
    super("http://localhost:3000/api/notes");
  }
  async createNewNote(
    fullDate: string,
    userId: string,
    folderId: string,
    frontendNoteId: string
  ) {
    const newNote = await this.post("/create-new-note", {
      fullDate,
      userId,
      folderId,
      frontendNoteId,
    });
  }
  async saveNewNoteTitle(noteTitle: string | number | boolean, noteId: string) {
    await this.put("/save-note-title", {
      noteTitle,
      noteId,
    });
  }
  async fetchAllUserNotes(userId: string) {
    const allNotes = await this.get("/fetch-user-notes", { userId });
    globalStore.set("userNotes", allNotes);
  }

  async deleteNote(noteId: string, folderId: string) {
    await this.delete("/delete-note", { noteId, folderId });
  }

  async getNote(noteId: string) {
    const note = await this.get("/get-specific-note", { noteId });
    console.log(note);
    noteObject.setNote(note.title, note.noteText, note.id, "note");
    noteObjectChanges.setNote(
      note.title,
      note.noteText,
      note.id,
      note.folderParentId
    );
    console.log(noteObject);
  }

  async autoSaveNote(noteId: string, noteTitle: string, noteText: string) {
    const note = await this.put("/auto-save-note", {
      noteId,
      noteTitle,
      noteText,
    });
  }
}

export default new ProjectService();
