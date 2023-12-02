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
    console.log(newNote);
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

  async deleteNote(noteId: string) {
    await this.delete("/delete-note", { noteId });
  }

  async getNote(noteId: string) {
    const note = await this.get("/get-specific-note", { noteId });
    noteObject.setNote(note.title, note.noteText, note.frontendId, "note");
    noteObjectChanges.setNote(
      note.title,
      note.noteText,
      note.frontendId,
      note.folderParentId
    );
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
