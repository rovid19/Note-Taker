import express from "express";
import { deleteTask, fetchTodo, saveTodoList } from "../Controllers/todo.js";

const router = express.Router();

router.put("/save-todo", saveTodoList);

router.get("/fetch-user-todo", fetchTodo);

router.put("/delete-task", deleteTask);

export default router;
