import Base from "./BaseService";
import globalStore from "../Stores/GlobalStore";
import { noteObject, noteObjectChanges, noteStore } from "../Stores/NoteStore";
import { NoteEdits } from "../Utils/TsTypes";

class ProjectService extends Base {
  constructor() {
    super(`https://note-editor-client.up.railway.app/notes`);
  }
  async createNewNote(
    fullDate: string,
    userId: string,
    folderId: string,
    frontendNoteId: string
  ) {
    await this.post("/create-new-note", {
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
    const diffNoteEdits = [...note.noteEdits];
    noteObject.setNote(
      note.title,
      note.noteText,
      note.id,
      "note",
      note.noteEdits
    );
    noteObjectChanges.setNote(
      note.title,
      note.noteText,
      note.id,
      note.folderParentId,
      diffNoteEdits
    );
  }

  async autoSaveNote(
    noteId: string,
    noteTitle: string,
    noteText: string,
    noteEdits: NoteEdits[]
  ) {
    noteStore.set("savingNoteInProgress", true);
    const note = await this.put("/auto-save-note", {
      noteId,
      noteTitle,
      noteText,
      noteEdits,
    });
    if (note) noteStore.set("savingNoteInProgress", false);
  }
}

export default new ProjectService();
