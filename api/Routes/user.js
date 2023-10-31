import express from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../Controllers/user.js";

const router = express.Router();

router.post("/register-user", registerUser);

router.post("/login-user", loginUser);

router.post("/logout-user", logoutUser);

router.get("/get-user", getUser);

export default router;
