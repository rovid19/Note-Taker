import express from "express";
import {
  deleteTask,
  fetchTodo,
  saveChangesToTodoItem,
  saveTodoList,
} from "../Controllers/todo.js";

const router = express.Router();

router.put("/create-todo-item", saveTodoList);

router.get("/fetch-user-todo", fetchTodo);

router.put("/save-item", saveChangesToTodoItem);

router.put("/delete-task", deleteTask);

export default router;
