import Note from "../Models/Note.js";

export const createNewNote = async (req, res) => {
  const { fullDate } = req.body;
  try {
    const newNote = await Note.create({
      title: "New Note",
      dateCreated: fullDate,
      noteText: "",
    });

    res.json(newNote);
  } catch (e) {
    throw e;
  }
};

export const saveNewNoteTitle = async (req, res) => {
  const { noteTitle, noteId } = req.body;
  try {
    const note = await Note.findById(noteId);
    note.set({
      title: noteTitle,
    });

    await note.save();

    res.json(note.noteTitle);
  } catch (e) {
    throw e;
  }
};

export const fetchAllUserNotes = async (req, res) => {
  try {
    const allNotes = await Note.find();
    res.json(allNotes.reverse());
  } catch (e) {
    throw e;
  }
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.body;

  try {
    await Note.findByIdAndDelete(noteId);

    res.json("ok");
  } catch (e) {
    throw e;
  }
};

export const fetchExistingNote = async (req, res) => {
  const { noteId } = req.query;

  const note = await Note.findById(noteId);
  res.json(note);
};

export const autoSaveNote = async (req, res) => {
  const { noteId, noteText, noteTitle } = req.body;

  const findNote = await Note.findById(noteId);

  findNote.set({
    title: noteTitle,
    noteText: noteText,
  });

  await findNote.save();

  res.json(findNote);
};