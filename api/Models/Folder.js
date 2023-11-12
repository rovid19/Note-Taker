import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  name: String,
  dateCreated: String,
  content: [
    { type: mongoose.Schema.Types.ObjectId, ref: "todo" },
    { type: mongoose.Schema.Types.ObjectId, ref: "folder" },
  ],
});

const folderModel = mongoose.model("folder", folderSchema);

export default folderModel;
