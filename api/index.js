import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import notesRoute from "./Routes/notes.js";
import userRoute from "./Routes/user.js";
import todoRoute from "./Routes/todo.js";
import path from "path";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(
  "mongodb+srv://Rock:rocketrocket@cluster0.7m0vxlq.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use("/api/notes", notesRoute);
app.use("/api/user", userRoute);
app.use("/api/todo", todoRoute);

app.listen(port);
