import express from "express";
import { fetchTodo, saveTodoList } from "../Controllers/todo.js";

const router = express.Router();

router.put("/save-todo", saveTodoList);

router.get("/fetch-user-todo", fetchTodo);

export default router;
