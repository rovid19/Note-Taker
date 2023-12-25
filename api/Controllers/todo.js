import Note from "../Models/Note.js";
import TodoItemModel from "../Models/TodoItem.js";
import User from "../Models/User.js";

export const saveTodoList = async (req, res) => {
  const { todoItem, userId } = req.body;
  const newTodoItem = await TodoItemModel.create({
    name: todoItem.name,
    isDone: todoItem.isDone,
    timeSpent: todoItem.timeSpent,
    frontendId: todoItem.frontendId,
  });
  const user = await User.findById(userId);

  user.todoList.push(newTodoItem);

  await user.save();

  res.json(user);
};

export const fetchTodo = async (req, res) => {
  const { userId } = req.query;

  const user = await User.findById(userId);

  res.json(user.todoList);
};

export const saveChangesToTodoItem = async (req, res) => {
  const { todoItem } = req.body;
  console.log(todoItem);

  const foundItem = await TodoItemModel.findOne({
    frontendId: todoItem.frontendId,
  });

  foundItem.set({
    isDone: todoItem.isDone,
  });

  await foundItem.save();
  res.json("ok");
};

export const deleteTask = async (req, res) => {
  const { todoItemId } = req.body;

  const deleteTodoItem = await TodoItemModel.findByIdAndDelete(todoItemId);

  res.json("alright");
};
