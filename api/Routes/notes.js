import express from "express";
import {
  createNewNote,
  deleteNote,
  fetchAllUserNotes,
  saveNewNoteTitle,
} from "../Controllers/notes.js";

const router = express.Router();

router.post("/create-new-note", createNewNote);

router.put("/save-note-title", saveNewNoteTitle);

router.get("/fetch-user-notes", fetchAllUserNotes);

router.delete("/delete-note", deleteNote);

export default router;
