import User from "../Models/User.js";
import Folder from "../Models/Folder.js";
import noteModel from "../Models/Note.js";

/*export const fetchAllUserFolders = async (req, res) => {
  const { userId } = req.query;

  const user = await User.findById(userId).populate({
    path: "folder",
    populate: {
      path: "content",
    },
  });

  res.json(user);
};*/

export const fetchAllUserFolders = async (req, res) => {
  try {
    const { userId } = req.query;

    const user = await User.findById(userId).populate("folder");
    console.log(user.folder);
    const populateProjects = async (array) => {
      for (let i = 0; i < array.length; i++) {
        const folderItem = array[i];

        if (folderItem.defaultSchemaType === "folder") {
          const popFolder = await Folder.findById(folderItem._id).populate(
            "content"
          );

          if (popFolder.content.length > 0) {
            await populateProjects(popFolder.content);
          }

          array[i] = popFolder;
        } else if (folderItem.defaultSchemaType === "note") {
          await noteModel.findById(folderItem._id).populate("");
        } else {
        }
      }
    };

    await populateProjects(user.folder);

    res.json(user);
  } catch (error) {
    throw error;
  }
};

export const createNewFolder = async (req, res) => {
  const {
    userId,
    folderName,
    folderId,
    folderParentId,
    fullDate,
    isMainFolder,
  } = req.body;

  if (isMainFolder) {
    try {
      const user = await User.findById(userId);
      const newFolder = await Folder.create({
        name: folderName,
        dateCreated: fullDate,
        type: "folder",
        depth: 0,
        frontendId: folderId,
      });

      user.folder.push(newFolder._id);

      await user.save();
      res.json(newFolder);
    } catch (e) {
      throw e;
    }
  } else {
    try {
      const folder = await Folder.findOne({ frontendId: folderParentId });
      const addLayerToDepth = folder.depth + 1;
      const newSubFolder = await Folder.create({
        name: folderName,
        dateCreated: fullDate,
        type: "folder",
        depth: addLayerToDepth,
        frontendId: folderId,
        parentId: folderParentId.length > 0 ? folderParentId : "",
      });

      folder.content.push(newSubFolder._id);

      await folder.save();
      res.json(newSubFolder);
    } catch (e) {
      throw e;
    }
  }
};

export const deleteFolder = async (req, res) => {
  const { frontendFolderId, depth } = req.body;

  const folder = await Folder.findOne({ frontendId: frontendFolderId });
  const deleteArray = [folder._id];

  const recursivePopulate = async (content) => {
    for (let folder of content) {
      const foundFolder = await Folder.findById(folder._id).populate("content");
      deleteArray.push(foundFolder._id);
      if (foundFolder.content.length > 0) {
        console.log("da");
        await recursivePopulate(foundFolder.content);
      }
    }
  };
  await recursivePopulate(folder.content);
  deleteArray.forEach(
    async (folderId) => await Folder.deleteOne({ _id: folderId })
  );

  if (folder.parentId) {
    const parentFolder = await Folder.findOne({ frontendId: folder.parentId });
    parentFolder.content = [];
    await parentFolder.save();
  }

  res.json("ok");
};
