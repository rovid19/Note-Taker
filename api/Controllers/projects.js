import User from "../Models/User.js";
import Folder from "../Models/Folder.js";

export const fetchAllUserFolders = async (req, res) => {
  const { userId } = req.query;

  const user = await User.findById(userId).populate({
    path: "folder",
    populate: {
      path: "content",
    },
  });

  res.json(user);
};

export const createNewFolder = async (req, res) => {
  const { userId, folderName, folderId, fullDate } = req.body;

  if (!folderId) {
    try {
      const user = await User.findById(userId);
      const newFolder = await Folder.create({
        name: folderName,
        dateCreated: fullDate,
        type: "folder",
      });

      user.folder.push(newFolder._id);

      await user.save();
      res.json("ok");
    } catch (e) {
      throw e;
    }
  } else {
    try {
      console.log("okdS");
      const folder = await Folder.findById(folderId);
      const newSubFolder = await Folder.create({
        name: folderName,
        dateCreated: fullDate,
        type: "folder",
      });

      folder.content.push(newSubFolder._id);

      await folder.save();
      res.json("ok");
    } catch (e) {
      throw e;
    }
  }
};
