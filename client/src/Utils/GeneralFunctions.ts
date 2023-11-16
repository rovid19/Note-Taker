import { counterArray, defaultFolder } from "../Stores/ProjectStore";
import { FolderInterface } from "./TsTypes";

export const fillSubfolderCounterArray = (
  userProjects: FolderInterface[]
): void => {
  const newArray = new Array(userProjects.length)
    .fill(null)
    .map(() => ({ id: "", index: [] }));
  counterArray.setCounterArray(newArray);
  defaultFolder.userFolder.forEach((folder, i) => {
    counterArray.setId(folder._id, i);
  });
  console.log(counterArray.counterArray);
};
