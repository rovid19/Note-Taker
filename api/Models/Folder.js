import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  name: String,
  dateCreated: String,
  content: [
    { type: mongoose.Schema.Types.ObjectId, ref: "folder" },
    { type: mongoose.Schema.Types.ObjectId, ref: "note" },
  ],
  type: String,
  depth: Number,
  frontendId: String,
  parentId: String,
  defaultSchemaType: { default: "folder", type: String },
});

const folderModel = mongoose.model("folder", folderSchema);

export default folderModel;
