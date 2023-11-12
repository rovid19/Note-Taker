import express from "express";
import {
  createNewFolder,
  fetchAllUserFolders,
} from "../Controllers/projects.js";

const router = express.Router();

router.get("/fetch-user-projects", fetchAllUserFolders);

router.post("/create-new-folder", createNewFolder);

export default router;
