import Note from "../Models/Note.js";

export const createNewNote = async (req, res) => {
  const { fullDate } = req.body;
  try {
    const newNote = await Note.create({
      title: "New Note",
      dateCreated: fullDate,
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
    console.log(note, noteTitle);
    res.json(note.noteTitle);
  } catch (e) {
    throw e;
  }
};

export const fetchAllUserNotes = async (req, res) => {
  try {
    const allNotes = await Note.find();
    res.json(allNotes);
  } catch (e) {
    throw e;
  }
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.body;

  try {
    const deleteNote = await Note.deleteOne(noteId);
    res.json("ok");
  } catch (e) {
    throw e;
  }
};
