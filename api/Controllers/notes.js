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
