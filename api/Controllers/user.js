import Note from "../Models/Note.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../Models/User.js";

const jwtSecret = "9i12349uoijdslkfslkfjasdf";
const bcryptSalt = bcryptjs.genSaltSync(10);

export const registerUser = async (req, res) => {
  const { email, username, password } = req.body;
  console.log(email, username, password);
  const existingUser = await User.findOne({ email });
  const existingUsername = await User.findOne({ username: username });

  if (existingUser) {
    res.status(400).json("Email already in use");
  } else {
    if (existingUsername) {
      res.status(400).json("Username already in use");
    } else {
      const newUser = await User.create({
        email,
        username,
        password: bcryptjs.hashSync(password, bcryptSalt),
      });

      res.json(newUser);
    }
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const userFound = await User.findOne({ email });

  if (userFound) {
    const checkPass = bcryptjs.compareSync(password, userFound.password);
    if (checkPass) {
      jwt.sign({}, jwtSecret, {}, async (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json(userFound);
      });
    } else {
      res.status(400).json("Email or password is wrong");
    }
  } else {
    res.status(400).json("Email or password is wrong");
  }
};
