import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  folder: [{ type: mongoose.Schema.Types.ObjectId, ref: "folder" }],
  todoList: [],
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
