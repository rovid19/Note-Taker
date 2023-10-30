import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import notesRoute from "./Routes/notes.js";
import userRoute from "./Routes/user.js";
import path from "path";

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

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());
app.use("/api/notes", notesRoute);
app.use("/api/user", userRoute);
app.listen(port);
