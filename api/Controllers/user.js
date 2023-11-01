import Note from "../Models/Note.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../Models/User.js";

const jwtSecret = "9i12349uoijdslkfslkfjasdf";
const bcryptSalt = bcryptjs.genSaltSync(10);

export const registerUser = async (req, res) => {
  const { email, username, password } = req.body;

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
      jwt.sign({ userId: userFound._id }, jwtSecret, {}, async (err, token) => {
        if (err) throw err;

        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .json(userFound);
      });
    } else {
      res.status(400).json("Email or password is wrong");
    }
  } else {
    res.status(400).json("Email or password is wrong");
  }
};

export const logoutUser = (req, res) => {
  res.cookie("token", "").json("ok");
};

export const getUser = (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
      if (err) throw err;
      console.log(user);
      const foundUser = await User.findById(user.userId);
      res.json(foundUser);
    });
  }
};
