import mongoose from "mongoose";

const todoItemSchema = new mongoose.Schema({
  name: String,
  isDone: Boolean,
});

const todoItemModel = mongoose.model("todoItem", todoItemSchema);

export default todoItemModel;
