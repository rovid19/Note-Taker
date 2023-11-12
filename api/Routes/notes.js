import express from "express";
import {
  autoSaveNote,
  createNewNote,
  deleteNote,
  fetchExistingNote,
  saveNewNoteTitle,
} from "../Controllers/notes.js";

const router = express.Router();

router.post("/create-new-note", createNewNote);

router.put("/save-note-title", saveNewNoteTitle);

/*router.get("/fetch-user-notes", fetchAllUserNotes);*/

router.delete("/delete-note", deleteNote);

router.get("/get-specific-note", fetchExistingNote);

router.put("/auto-save-note", autoSaveNote);

export default router;
