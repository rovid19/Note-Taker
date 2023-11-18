import { counterArray, defaultFolder } from "../Stores/ProjectStore";
import { FolderInterface } from "./TsTypes";

export const fillSubfolderCounterArray = (
  userProjects: FolderInterface[]
): void => {
  counterArray.setCounterArray([...userProjects]);
};
