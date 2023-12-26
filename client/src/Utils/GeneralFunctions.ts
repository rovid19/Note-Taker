import { loopThroughArray } from "../Components/Sidebar/SidebarFolderLogic";
import { noteObjectChanges } from "../Stores/NoteStore";
import {
  folderObject,
  projectStore,
  userProjects,
} from "../Stores/ProjectStore";
import { FolderInterface, Note } from "./TsTypes";
import { noteStore } from "../Stores/NoteStore";
import noteService from "../Services/NoteService";
import { changeNoteEditIndexesAccordingly } from "../Components/NoteEditor/NoteEditorLogic";
import { defaultUser } from "../Stores/UserStore";
export const generateRandomId = (idLength: number): string => {
  const chars = "ghjsdfgjhasfduiweqrzqwer87238723zugvcxgf1721262gs";
  let results = "";
  for (let i = 0; i < idLength; i++) {
    results += chars.charAt(Math.floor(Math.random() * idLength));
  }
  return results;
};

export const loopThroughArrayAndPushOrDeleteFolder = (
  projects: (FolderInterface | Note)[],
  parentId: string,
  folderItem: FolderInterface | Note,
  purpose: string,
  frontendId?: string
): void => {
  const foundFolder = loopThroughArray(projects, parentId, "newFolder");
  if (purpose === "delete") {
    if ("noteText" in folderItem) {
      const newNotes = foundFolder.notes.filter(
        (folderNote) => folderNote.id !== frontendId
      );
      foundFolder.notes = newNotes;
    } else if ("depth" in folderItem) {
      const newArray = foundFolder.content.filter(
        (folder) => (folder as FolderInterface).frontendId !== frontendId
      );
      foundFolder.content = newArray;
    } else {
    }
  } else {
    if ("content" in folderItem) {
      foundFolder.content.push(folderItem);
    } else {
      foundFolder.notes.push({ ...folderItem });
    }
  }
};

export const loopThroughArrayAndSaveNewFolderItem = (
  projects: (FolderInterface | Note)[],
  parentId: string,
  purpose: string
): void => {
  if (purpose === "folder") {
    const foundFolder = loopThroughArray(projects, parentId, "newFolder");
    const index = foundFolder.content.findIndex((folder) => {
      (folder as FolderInterface).frontendId === folderObject.folder.frontendId;
    });
    foundFolder.content[index] = folderObject.folder;
    projectStore.set("subfolderFolderObject", folderObject.folder);
    folderObject.setSelectedFolder(foundFolder);
  } else {
    const foundFolder = loopThroughArray(projects, parentId, "newFolder");
    const index = foundFolder.notes.findIndex(
      (note) => note.id === noteObjectChanges.id
    );
    foundFolder.notes[index].title = noteObjectChanges.title;
  }
};

export const addIcon = (folderItem: FolderInterface | Note): string => {
  if (folderItem.type === "folder")
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15">
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>
  `;
  else if (folderItem.type === "note")
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

export const getSelectionIndex = (purpose: string) => {
  const editableDiv = document.querySelector(
    ".newNoteInputText"
  ) as HTMLElement;
  const selection = window.getSelection();
  if (selection) {
    if (selection.rangeCount > 0) {
      //prvobitan selection
      const range = selection.getRangeAt(0);
      console.log(range);
      //dupliciranje prvobitnog selectiona
      const preSelectionRange = range.cloneRange();
      //pretvranje cloneRangea da bude text cijelog diva, a ne samo selectana rijec
      preSelectionRange.selectNodeContents(editableDiv);
      //cloneRange sad zavrsava tu gdje prvobitan selection pocinje
      preSelectionRange.setEnd(range.startContainer, range.startOffset);

      //izracun start i end indexa
      const start = preSelectionRange.toString().length;
      const end = start + range.toString().length;
      if (purpose === "onClick") {
        /*console.log(
          start,
          editableDiv.textContent?.length,
          noteObjectChanges.noteText.length,
          noteObjectChanges.noteEdits
        );*/
        console.log(start, noteObjectChanges.noteEdits);
        noteStore.set("currentTextIndex", start);
        noteStore.set("backspaceCount", 0);
      } else {
        if (start === end) {
          noteStore.set("enterIndex", { startIndex: start });
        } else
          noteStore.set("selectedText", { startIndex: start, endIndex: end });
      }
    }
  }
};

export const replaceCharAtString = (
  string: string,
  replacement: string,
  start: number,
  end: number
): string => {
  return string.slice(0, start) + replacement + string.slice(end);
};
export const addOneCharAtStartOrEndIndex = (
  string: string,
  replacement: string,
  index: number
): string => {
  return string.slice(0, index) + replacement + string.slice(index);
};

export const autoSaveNote = async () => {
  await noteService.autoSaveNote(
    noteObjectChanges.id,
    noteObjectChanges.title,
    noteObjectChanges.noteText,
    noteObjectChanges.noteEdits
  );
};

export const setNoteEditIndexesAccordingToNoteTextInput = (
  e: KeyboardEvent
) => {
  noteStore.push("addedText", e.key);
  getSelectionIndex("onClick");
  changeNoteEditIndexesAccordingly();
};

export const arrayIncludesAll = (arrayA: number[], arrayB: number[]) => {
  return arrayA.every((number: number) => arrayB.includes(number));
};

export const arrayIncludes = (
  arrayA: number[],
  arrayB: number[] | number
): boolean => {
  let includes = false;
  if (typeof arrayB === "number") {
    arrayA.forEach((number) => {
      if (number === arrayB) {
        includes = true;
      }
    });
  } else {
    arrayA.forEach((number) => {
      if (arrayB.includes(number)) {
        includes = true;
      }
    });
  }
  return includes;
};

export const putAllFoldersIntoAnArray = (): void => {
  const newArray = [] as FolderInterface[];

  const recursivePopulate = (projectArray: FolderInterface[]) => {
    for (let folder of projectArray) {
      newArray.push(folder);
      if (folder.content.length > 0) {
        recursivePopulate(folder.content as FolderInterface[]);
      }
    }
  };

  recursivePopulate(userProjects.projects as FolderInterface[]);

  defaultUser.setUserFolder(newArray);
};

export const ifNoteEditorActiveExtractNoteIdFromUrl = () => {
  const url = window.location.href.replace(
    "http://localhost:5173/projects/",
    ""
  );
  noteStore.set("noteIdFromUrl", url);
};

export const loaderAnimation = (): void => {
  const userFolders = projectStore.get("userFolders") as number;
  const currentWidth = projectStore.get("currentWidth") as number;

  const loader = document.querySelector(".loaderAfter") as HTMLElement;
  const count = 100 / userFolders;
  let increaseBy = currentWidth + count;
  if (increaseBy > 100) increaseBy = 100;
  loader.style.width = `${increaseBy}%`;
  projectStore.set("currentWidth", increaseBy);
};

export const apiUrl = "https://note-editor-api.up.railway.app/";
export const apiLocalUrl = "http://localhost:3000/";
