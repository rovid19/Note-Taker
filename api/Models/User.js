import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  userNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "note" }],
  todoList: [],
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
