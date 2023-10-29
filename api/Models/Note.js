import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: String,
  noteText: String,
  dateCreated: String,
});

const noteModel = mongoose.model("note", noteSchema);

export default noteModel;