import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "folderModel", // Reference the model based on the 'folderModel' path
  },

  folderModel: {
    type: String,
  },
  todoList: [{ type: mongoose.Schema.Types.ObjectId, ref: "todo" }],
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
