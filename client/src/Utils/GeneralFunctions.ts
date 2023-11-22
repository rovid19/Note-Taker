import { loopThroughArray } from "../Components/Sidebar/SidebarLogic";
import { FolderInterface } from "./TsTypes";

export const generateRandomId = (idLength: number): string => {
  const chars = "ghjsdfgjhasfduiweqrzqwer87238723zugvcxgf1721262gs";
  let results = "";
  for (let i = 0; i < idLength; i++) {
    results += chars.charAt(Math.floor(Math.random() * idLength));
  }
  console.log(results);
  return results;
};

export const loopThroughArrayReturnFoundFolderAndPushNewFolderInside = (
  projects: FolderInterface[],
  id: string,
  folder: FolderInterface
) => {
  console.log(folder);
  const foundFolder = loopThroughArray(projects, id, "newFolder");
  foundFolder.content.push(folder);
};
