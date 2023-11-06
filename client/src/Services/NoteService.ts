import { defaultNote } from "../Components/NoteEditor/NoteEditor";
import Base from "../Services/BaseService";
import globalStore from "../Stores/GlobalStore";
import { router } from "../Utils/Router";

class NoteService extends Base {
  constructor() {
    super("http://localhost:3000/api/notes");
  }
  async createNewNote(fullDate: string, userId: string) {
    const newNote = await this.post("/create-new-note", { fullDate, userId });
    defaultNote.setNote(
      newNote.title,
      newNote.title,
      newNote.dateCreated,
      newNote.noteText,
      newNote.noteText,
      newNote._id
    );
    router.navigateTo(`/notes/noteId=${defaultNote.id}`);
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

  async getNote() {
    const noteId = globalStore.get("noteId") as string;
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
