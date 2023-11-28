import { loopThroughArray } from "../Components/Sidebar/SidebarFolderLogic";
import { folderObject, projectStore } from "../Stores/ProjectStore";
import { FolderInterface, Item } from "./TsTypes";

export const generateRandomId = (idLength: number): string => {
  const chars = "ghjsdfgjhasfduiweqrzqwer87238723zugvcxgf1721262gs";
  let results = "";
  for (let i = 0; i < idLength; i++) {
    results += chars.charAt(Math.floor(Math.random() * idLength));
  }
  return results;
};

export const loopThroughArrayAndPushOrDeleteFolder = (
  projects: FolderInterface[],
  parentId: string,
  folder: FolderInterface,
  purpose: string,
  frontendId?: string
): void => {
  const foundFolder = loopThroughArray(projects, parentId, "newFolder");
  if (purpose === "add") {
    foundFolder.content.push(folder);
  } else {
    console.log(foundFolder);
    const newArray = foundFolder.content.filter(
      (folder) => folder.frontendId !== frontendId
    );
    console.log(newArray);
    foundFolder.content = newArray;
  }
};

export const loopThroughArrayAndSaveNewFolder = (
  projects: FolderInterface[],
  parentId: string
): void => {
  const foundFolder = loopThroughArray(projects, parentId, "newFolder");
  const index = foundFolder.content.findIndex((folder) => {
    if ("frontendId" in foundFolder) {
      folder.frontendId === folderObject.folder.frontendId;
    }
  });
  foundFolder.content[index] = folderObject.folder;
  projectStore.set("subfolderFolderObject", folderObject.folder);
  folderObject.setSelectedFolder(foundFolder);
};

export const addIcon = (item: Item): string => {
  if (item.type === "folder")
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15">
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>
  `;
  else if (item.type === "note")
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
  `;
  else
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
  </svg>
  `;
};
