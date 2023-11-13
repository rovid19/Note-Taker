import User from "../Models/User.js";
import Folder from "../Models/Folder.js";

export const fetchAllUserFolders = async (req, res) => {
  const { userId } = req.query;

  const user = await User.findById(userId).populate("folder");

  res.json(user);
};

export const createNewFolder = async (req, res) => {
  const { userId, folderName, folderId, fullDate } = req.body;

  const user = await User.findById(userId);

  const newFolder = await Folder.create({
    name: folderName,
    dateCreated: fullDate,
  });

  user.folder.push(newFolder._id);

  await user.save();

  res.json("ok");
};
