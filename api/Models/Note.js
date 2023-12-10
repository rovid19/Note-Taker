import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: String,
  noteText: String,
  dateCreated: String,
  type: String,
  folderParentId: String,
  id: String,
  noteEdits: [],
});

const noteModel = mongoose.model("note", noteSchema);

export default noteModel;
