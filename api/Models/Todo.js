import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  name: String,
  dateCreated: String,
  todoItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "todoItem" }],
  type: String,
});

const todoModel = mongoose.model("todo", todoSchema);

export default todoModel;
