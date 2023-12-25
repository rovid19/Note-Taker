import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import notesRoute from "./Routes/notes.js";
import userRoute from "./Routes/user.js";
import todoRoute from "./Routes/todo.js";
import projectRoute from "./Routes/projects.js";
import path from "path";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";

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
    origin: ["http://note-editor-client.up.railway.app"],
  })
);

app.use("/api/notes", notesRoute);
app.use("/api/user", userRoute);
app.use("/api/todo", todoRoute);
app.use("/api/projects", projectRoute);
console.log(port);
const httpServer = createServer(app);
httpServer.listen(port);
export const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: ["http://note-editor-client.up.railway.app"],
  },
});

export const userSockets = {};

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    userSockets[userId] = socket.id;
  });

  socket.on("disconnect", () => {
    Object.keys(userSockets).forEach((userId) => {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
      }
    });
  });
});

//app.listen(port);
