import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  name: String,
  dateCreated: String,
  content: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      kind: String,
    },
  ],
});

const folderModel = mongoose.model("folder", folderSchema);

export default folderModel;
