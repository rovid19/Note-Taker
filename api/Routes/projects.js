import express from "express";
import {
  createNewFolder,
  deleteFolder,
  fetchAllUserFolders,
} from "../Controllers/projects.js";

const router = express.Router();

router.get("/fetch-user-projects", fetchAllUserFolders);

router.post("/create-new-folder", createNewFolder);

router.put("/delete-folder", deleteFolder);

export default router;
