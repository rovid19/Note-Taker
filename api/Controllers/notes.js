import Note from "../Models/Note.js";
import Folder from "../Models/Folder.js";

export const createNewNote = async (req, res) => {
  const { fullDate, userId, folderId, frontendNoteId } = req.body;
  try {
    const folder = await Folder.findOne({ frontendId: folderId });
    const newNote = await Note.create({
      title: "New Note",
      dateCreated: fullDate,
      noteText: "",
      folderParentId: folderId,
      id: frontendNoteId,
      type: "note",
    });

    folder.notes.push(newNote._id);

    await folder.save();

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

/*export const fetchAllUserNotes = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findById(userId);

    user.folderModel = "Folder";

    await user.populate("folder", "name");

    res.json(user);
  } catch (e) {
    throw e;
  }
};*/

export const deleteNote = async (req, res) => {
  const { noteId, folderId } = req.body;

  try {
    const not2e = await Note.findOne({ id: noteId });
    const parentFolder = await Folder.findOne({ frontendId: folderId });
    parentFolder.notes = parentFolder.notes.filter(
      (note) => note.toString() !== not2e._id.toString()
    );
    await parentFolder.save();
    res.json(parentFolder);
  } catch (e) {
    throw e;
  }
};

export const fetchExistingNote = async (req, res) => {
  const { noteId } = req.query;

  const note = await Note.findOne({ id: noteId });
  res.json(note);
};

export const autoSaveNote = async (req, res) => {
  const { noteId, noteText, noteTitle, noteEdits } = req.body;

  const findNote = await Note.findOne({ id: noteId });
  console.log(findNote, noteId);
  findNote.set({
    title: noteTitle,
    noteText: noteText,
    noteEdits,
  });

  await findNote.save();

  res.json(findNote);
};
