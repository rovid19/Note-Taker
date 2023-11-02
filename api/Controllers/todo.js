import Note from "../Models/Note.js";
import User from "../Models/User.js";

export const saveTodoList = async (req, res) => {
  const { todoItem, userId } = req.body;

  const user = await User.findById(userId);

  user.todoList.push(todoItem);

  await user.save();

  res.json(user);
};

export const fetchTodo = async (req, res) => {
  const { userId } = req.query;

  const user = await User.findById(userId);

  res.json(user.todoList);
};
