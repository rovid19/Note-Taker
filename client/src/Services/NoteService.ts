import { defaultNote } from "../Components/NoteEditor/NoteEditor";
import Base from "../Services/BaseService";
import globalStore from "../Stores/GlobalStore";

class NoteService extends Base {
  constructor() {
    super("http://localhost:3000/api/notes");
  }
  async createNewNote(fullDate: string) {
    const newNote = await this.post("/create-new-note", { fullDate });
    globalStore.set("newNoteId", newNote._id);
  }
  async saveNewNoteTitle(noteTitle: string | number | boolean, noteId: string) {
    const newNoteTitle = await this.put("/save-note-title", {
      noteTitle,
      noteId,
    });
    defaultNote.setNoteTitle(newNoteTitle);
  }
}

export default new NoteService();
