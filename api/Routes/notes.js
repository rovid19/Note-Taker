import express from "express";
import { createNewNote, saveNewNoteTitle } from "../Controllers/notes.js";

const router = express.Router();

router.post("/create-new-note", createNewNote);

router.put("/save-note-title", saveNewNoteTitle);

export default router;
