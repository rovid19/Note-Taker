import { projectStore, folderObject } from "../../Stores/ProjectStore";
import { defaultFolder } from "../../Stores/ProjectStore";
import globalStore from "../../Stores/GlobalStore";
import { FolderInterface, Note } from "../../Utils/TsTypes";
import { userProjects } from "../../Stores/ProjectStore";
import { addIcon, generateRandomId } from "../../Utils/GeneralFunctions";
import { fullDate } from "../../Utils/Date";
import {
  createNewFolderLogic,
  reRenderAllFolderContainer,
  renderTotalNumberOfUserProjects,
} from "./SidebarLogic";
import { projectService } from "../../Services/ProjectService";
import { defaultUser } from "../../Stores/UserStore";
import {
  createNewNote,
  fetchSelectedNoteAndNavigateToIt,
} from "../NoteEditor/NoteEditorLogic";
import {
  noteObject,
  noteObjectChanges,
  noteStore,
} from "../../Stores/NoteStore";
import { router } from "../../Utils/Router/Router";
import noteService from "../../Services/NoteService";

export const eventDelegationForProjects = (sidebarDiv2: HTMLElement): void => {
  const allArticles = document.querySelectorAll(".sidebarArticle");
  const newlyAddedFolderInput = document.querySelector(
    ".addNewFolderInput"
  ) as HTMLElement;
  sidebarDiv2?.addEventListener("click", (e: Event): void => {
    const target = e.target as HTMLElement;
    const parentElementCreateNewFolder = target.closest(".createNewFolderBtn");
    const isParentFolder = target.closest("[data-id]") as HTMLElement;

    if (parentElementCreateNewFolder) {
      createNewFolderLogic(e);
    } else if (isParentFolder) {
      /*autoSaveNote();
        setNoteIdToOpenNote(allArticles, parentElementOpen);
        const noteId = noteStore.get("noteId");
        router.navigateTo(`/notes/noteId=${noteId}`);
        noteStore.set("existingNote", true);
        globalStore.set("noteEditorVisible", true);*/
      const selectedFolder = selectFolder(
        allArticles,
        isParentFolder,
        "folder"
      );
      isFolderOpenOrClosed(selectedFolder, "");
    }
  });
  sidebarDiv2?.addEventListener("contextmenu", (e: Event): void => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const parentElementArticle = target.closest(".sidebarArticle") as Element;
    const isParentFolder = target.closest("[data-id]") as HTMLElement;

    if (parentElementArticle) {
      projectStore.set("createMainFolder", false);
      closeRightClickMenuIfOpen();
      selectFolder(allArticles, isParentFolder, "folder");
      createFolderRightClickMenu(parentElementArticle, allArticles);
    }
  });

  sidebarDiv2.addEventListener("mouseover", (e: Event) => {
    const target = e.target as HTMLElement;
    const isParentFolder = target.closest("[data-id]") as HTMLElement;
    if (isParentFolder) isParentFolder.setAttribute("data", "hover");
  });

  sidebarDiv2.addEventListener("mouseout", (e: Event) => {
    const target = e.target as HTMLElement;
    const isParentFolder = target.closest("[data-id]") as HTMLElement;

    if (isParentFolder) isParentFolder.removeAttribute("data");
  });
  if (newlyAddedFolderInput) {
    newlyAddedFolderInput.addEventListener("input", (e: Event): void => {
      const target = e.target as HTMLInputElement;
      folderObject.setNewFolderTitle(target.value);
    });
  }
};

// SELECTING FOLDER WHEN CLICKING OR RIGHT CLICKING *******************************
// ˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘
const selectFolder = (
  allFolders: NodeListOf<Element>,
  isParentFolder: HTMLElement,
  target: string,
  noteTarget?: string
): HTMLElement => {
  const array = [...allFolders];
  let selectedFolderElement = {} as HTMLElement;
  if (target === "folder") {
    if (isParentFolder) {
      array.forEach((folder) => {
        if (folder === isParentFolder) {
          selectedFolderElement = folder as HTMLElement;
          const folderId = isParentFolder.dataset.id as string;
          loopThroughProjectArrayAndSetSelectedFolder(folderId);
          projectStore.set("selectedFolderElement", folder);
        }
      });
    }
  } else if (target === "note") {
    const sidebarVisible = globalStore.get("sidebarVisible") as boolean;
    const noteId = isParentFolder.dataset.id as string;
    globalStore.set("noteEditorVisible", false);
    noteObject.setId(noteId);
    if (noteTarget === "rightClick")
      fetchSelectedNoteAndNavigateToIt(sidebarVisible, "delete");
    else fetchSelectedNoteAndNavigateToIt(sidebarVisible, "");
  }

  return selectedFolderElement;
};

const isFolderOpenOrClosed = (
  selectedFolder: HTMLElement,
  purpose: string
): void => {
  isAnySubfolderOpen();
  if (selectedFolder.id === "opened") {
    checkIfThisFunctionIsRanByRightClickMenu(selectedFolder, purpose);
  } else {
    openSelectedFolder(selectedFolder);
  }
};

const checkIfThisFunctionIsRanByRightClickMenu = (
  selectedFolder: HTMLElement,
  purpose: string
) => {
  if (purpose === "rightClick") {
    closeSelectedFolder(selectedFolder);
    openSelectedFolder(selectedFolder);
  } else {
    closeSelectedFolder(selectedFolder);
  }
};

const isAnySubfolderOpen = () => {
  const sidebarDiv2 = document.querySelector(".sidebarDiv2") as HTMLElement;
  setTimeout(() => {
    const isThereAnySubfolderOpen = sidebarDiv2.querySelector(".folderSubmenu");
    if (isThereAnySubfolderOpen) {
      projectStore.set("subfolderVisible", true);
    } else {
      projectStore.set("subfolderVisible", false);
    }
  }, 0);
};

export const openSelectedFolder = (selectedFolder: HTMLElement): void => {
  const elementIcon = selectedFolder.querySelector(".svgHolder") as HTMLElement;
  elementIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
  `;
  selectedFolder.id = "opened";
  createSelectedFolderSubmenu(selectedFolder);
};

export const closeSelectedFolder = (selectedFolder: HTMLElement): void => {
  const elementIcon = selectedFolder.querySelector(".svgHolder") as HTMLElement;
  elementIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  `;
  selectedFolder.id = "";
  const selectedFolderSubmenu = selectedFolder.querySelector(
    ".folderSubmenu"
  ) as HTMLElement;

  if (selectedFolderSubmenu) {
    selectedFolderSubmenu.remove();
  }
};

export const loopThroughProjectArrayAndSetSelectedFolder = (
  folderId: string
): void => {
  const newArray = userProjects.projects;
  loopThroughArray(newArray, folderId, "openCloseFolder");
};

export const loopThroughArray = (
  array: any[],
  folderId: string,
  purpose: string
): FolderInterface => {
  let newFolder = {} as FolderInterface;
  for (let folder of array) {
    if (purpose === "delete") {
      deleteFolder(folder, folderId);
    } else if (folder.frontendId === folderId) {
      if (purpose === "newFolder") {
        newFolder = folder;
      } else if (purpose === "openCloseFolder") {
        setSelectedFolder(folder);
      }
    } else {
      if (folder.content.length > 0) {
        const result = loopThroughArray(folder.content, folderId, purpose);
        if (result.frontendId) {
          return result;
        }
      }
    }
  }
  return newFolder;
};
const setSelectedFolder = (folder: FolderInterface): void => {
  defaultFolder.selectedFolder(
    folder.name,
    folder._id,
    "",
    folder.frontendId,
    folder.depth,
    folder.content
  );
  folderObject.setSelectedFolder(folder);
};

// CREATING RIGHT CLICKING MENU AND ATTACHING ITS EVENT LISTENERS *****************
// ˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘
const createFolderRightClickMenu = (
  isParentElementArticle: Element,
  allArticles: NodeListOf<Element>
): void => {
  const array = [...allArticles];
  array.forEach((folder) => {
    if (folder === isParentElementArticle) {
      const itemElement = folder as HTMLElement;
      projectStore.set("rightClickVisible", true);
      const subMenu = document.createElement("div");
      subMenu.className = "subMenu";
      if (itemElement.dataset.type === "folder") {
        subMenu.innerHTML = `
        <nav class="submenuNav">
          <ul> 
            <li class="addSubFolderLi"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15">
              <path fill-rule="evenodd" d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm-6.75-10.5a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V10.5z" clip-rule="evenodd" />
              </svg>
              Add new subfolder </li>
            <li class="addNoteLi"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15">
              <path fill-rule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
              </svg>
              Add new note </li>
            <li class="addTaskLi"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15">
              <path d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" />
              </svg>
              Add new task list</li>
            <li class="deleteFolderLi"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15">
              <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
              </svg>
              Delete folder</li>
          </ul>
        </nav>
        `;
      } else {
        rightClickMapForNotes(subMenu);
      }

      folder.appendChild(subMenu);
      rightClickMenuEventListeners(allArticles);
    }
  });
};

const rightClickMenuEventListeners = (
  allArticles: NodeListOf<Element>
): void => {
  const submenu = document.querySelector(".subMenu") as HTMLElement;
  submenu.addEventListener("click", (e: Event): void => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const isParentFolder = target.closest("[data-id]") as HTMLElement;
    const parentElementAddFolder = target.closest(".addSubFolderLi");
    const parentElementAddNote = target.closest(".addNoteLi");
    const parentElementAddTask = target.closest(".addTaskLi");
    const selectedFolderElement = projectStore.get(
      "selectedFolderElement"
    ) as HTMLElement;
    if (parentElementAddFolder) {
      projectStore.set("createNewFolder", true);
      isFolderOpenOrClosed(selectedFolderElement, "rightClick");
      closeRightClickMenuIfOpen();
    } else if (parentElementAddNote) {
      createNewNote(folderObject.folder.frontendId);
      closeRightClickMenuIfOpen();
      userProjects.addNewItem(noteObjectChanges, noteObjectChanges.parentId);
      reRenderSubfolder(selectedFolderElement);
    } else if (parentElementAddTask) globalStore.set("todoListVisible", true);
    else {
      let itemBeingDeleted = isFolderNoteOrTaskBeingDeleted(submenu);
      if (itemBeingDeleted === "folder") deleteFolderFunction();
      else if (itemBeingDeleted === "note")
        deleteNoteFunction(allArticles, isParentFolder);
      else {
      }
    }
  });
};

const isFolderNoteOrTaskBeingDeleted = (submenu: HTMLElement): string => {
  const submenuParent = submenu.parentNode as HTMLElement;

  return submenuParent.dataset.type === "folder"
    ? "folder"
    : submenuParent.dataset.type === "note"
    ? "note"
    : "task";
};

const deleteFolderFunction = () => {
  if (folderObject.folder.parentId) {
    deleteFolder(folderObject.folder, folderObject.folder._id);
  } else {
    deleteFolder(folderObject.folder, folderObject.folder._id);
    reRenderAllFolderContainer();
  }
};

const deleteNoteFunction = async (
  allArticles: NodeListOf<Element>,
  isParentFolder: HTMLElement
) => {
  selectFolder(allArticles, isParentFolder, "note", "rightClick");
};

/*const findIndexToDeleteNote = (
    allSvgs: NodeListOf<Element>,
    parentElement: Element
  ): void => {
    const array = [...allSvgs];
    array.findIndex((item, i) => {
      if (item === parentElement) {
        noteStore.set("deleteNote", i);
      }
    });
  };
  
  const setNoteIdToOpenNote = (
    allArticles: NodeListOf<Element>,
    parentElement: Element
  ) => {
    const array = [...allArticles];
    const userNotes = noteStore.get("userNotes") as unknown as UserNotes[];
    array.findIndex((item, i) => {
      if (item === parentElement) {
        noteStore.set("noteId", userNotes[i]._id);
      }
    });
  };*/

export const closeRightClickMenuIfOpen = (): void => {
  const rightClickVisible = projectStore.get("rightClickVisible");
  if (rightClickVisible) {
    document.querySelector(".subMenu")?.remove();
    projectStore.set("rightClickVisible", false);
  }
};

// CREATING SUBFOLDERS AND ATTACHING ITS EVENT LISTENERS **************************
// ˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘
const createSelectedFolderSubmenu = (selectedFolder: HTMLElement): void => {
  const menu = document.createElement("div");
  menu.className = "folderSubmenu";
  if (folderObject.folder.content === undefined) {
  } else if (folderObject.folder.content.length > 0) {
    folderObject.folder.content.map((folder: FolderInterface) => {
      menu.innerHTML += `
          <article class="submenuArticle" data-type=${folder.type} id=${
        folder.type
      } data-id=${
        folder.frontendId
      }> <div class="articleInnerDiv1"> <div class="svgHolder">${addIcon(
        folder
      )}</div> ${
        !folder.new
          ? `<h2 class="articleTitle2" > ${folder.name} </h2>`
          : `<input class="addNewFolderInput" newFolder="new" placeholder="Enter new folder name"/>`
      } </article></div>
        `;
    });
  }

  if (folderObject.folder.notes) {
    folderObject.folder.notes.map((note: Note) => {
      menu.innerHTML += `
            <article class="submenuArticle" data-type=${
              note.type
            } data-note="" data-id=${
        note.id
      } data-type="note"> <div class="articleInnerDiv1"> <div class="svgHolder">${addIcon(
        note
      )}</div> ${
        !note.new
          ? `<h2 class="articleTitle2" > ${note.title} </h2>`
          : `<input class="addNewFolderInput" newFolder="new" placeholder="Enter new folder name"/>`
      } </article></div>
          `;
    });

    selectedFolder.appendChild(menu);
    const selectedFolderSubmenu = selectedFolder.querySelector(
      ".folderSubmenu"
    ) as HTMLElement;

    createDivIndent(selectedFolderSubmenu);
    subfolderEventDelegations(selectedFolderSubmenu);
  }
};

const subfolderEventDelegations = (folder: HTMLElement): void => {
  const allFolderItems = folder.querySelectorAll(".submenuArticle");
  const newlyAddedFolderInput = document.querySelector(
    ".addNewFolderInput"
  ) as HTMLElement;

  folder.addEventListener("click", (e: Event): void => {
    const target = e.target as HTMLElement;
    const isTargetFolder = target.closest("[data-id]") as HTMLElement;
    const isTargetNote = target.closest("[data-note]") as HTMLElement;

    if (isTargetNote) {
      e.stopPropagation();
      selectFolder(allFolderItems, isTargetNote, "note");
    } else if (isTargetFolder) {
      e.stopPropagation();
      const selectedFolder = selectFolder(
        allFolderItems,
        isTargetFolder,
        "folder"
      );
      if (selectedFolder) isFolderOpenOrClosed(selectedFolder, "");
    }
  });

  folder.addEventListener("contextmenu", (e: Event): void => {
    const target = e.target as HTMLElement;
    const isParentFolder = target.closest("[data-id]") as HTMLElement;

    e.stopPropagation();
    e.preventDefault();
    projectStore.set("createMainFolder", false);
    selectFolder(allFolderItems, isParentFolder, "folder");
    closeRightClickMenuIfOpen();
    createFolderRightClickMenu(isParentFolder, allFolderItems);
  });

  folder.addEventListener("mouseover", (e: Event): void => {
    const target = e.target as HTMLElement;
    const isParentFolder = target.closest("[data-id]") as HTMLElement;

    isParentFolder.setAttribute("data", "hover");
  });

  folder.addEventListener("mouseout", (e: Event): void => {
    const target = e.target as HTMLElement;
    const isParentFolder = target.closest("[data-id]") as HTMLElement;

    if (isParentFolder) {
      isParentFolder.removeAttribute("data");
    }
  });

  if (newlyAddedFolderInput) {
    newlyAddedFolderInput.addEventListener("input", (e: Event): void => {
      const target = e.target as HTMLInputElement;
      folderObject.setNewFolderTitle(target.value);
    });
  }
};

// ADDING DIV INDETS TO SUBFOLDERS ************************************************
// ˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘
export const createDivIndent = (selectedFolderSubmenu: HTMLElement): void => {
  const divIndent = document.createElement("div");
  divIndent.style.width = `${8 * defaultFolder.folderDepth}px`;
  divIndent.style.borderRight = "2px solid #404040";
  divIndent.className = "divIndent";
  selectedFolderSubmenu.appendChild(divIndent);
  attachDivIndentToAllSubfolders(selectedFolderSubmenu, divIndent);
};

export const attachDivIndentToAllSubfolders = (
  selectedFolderSubmenu: HTMLElement,
  divIndent: HTMLElement
) => {
  const svgHolder = selectedFolderSubmenu.querySelectorAll(
    ".svgHolder"
  ) as NodeListOf<Element>;
  const svgHolderArray = [...svgHolder];
  svgHolderArray.forEach((folder) => {
    const parent = folder.parentNode as HTMLElement;
    parent.insertBefore(divIndent.cloneNode(true), folder);
  });
};

// CREATE NEW FOLDER *************************************************************
// ˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘
export const isCreateNewFolderVisible = (): void => {
  const createNewFolderVisible = projectStore.get("createNewFolder");
  if (createNewFolderVisible) {
    createNewFolder();
    window.addEventListener("click", removableCreateFolderListener);
  } else {
    window.removeEventListener("click", removableCreateFolderListener);
    saveFolderToDatabase();
    defaultFolder.selectedFolder("", "", "", "", 0, []);
    //s ovim rerendom je ista stvar ko i s gornjim ak je mainfolder u pitanju rerenderaj
    //a ako nije nemoj rerendarati
    //reRenderAllFolderContainer();
  }
};

const saveFolderToDatabase = (): void => {
  const createMainFolder = projectStore.get("createMainFolder") as boolean;
  const subfolderFolderObject = projectStore.get(
    "subfolderFolderObject"
  ) as unknown as FolderInterface;
  if (createMainFolder) {
    projectService.addNewFolder(
      defaultUser.id,
      folderObject.folder.name,
      folderObject.folder.frontendId,
      folderObject.folder.parentId,
      fullDate,
      createMainFolder
    );
  } else {
    projectService.addNewFolder(
      defaultUser.id,
      subfolderFolderObject.name,
      subfolderFolderObject.frontendId,
      subfolderFolderObject.parentId,
      fullDate,
      createMainFolder
    );
  }
};

export const createNewFolder = (): void => {
  const createMainFolder = projectStore.get("createMainFolder");
  const newFolder = {
    name: "New folder",
    dateCreated: fullDate,
    content: [],
    notes: [],
    type: "folder",
    _id: generateRandomId(12),
    //parentId postoji samo ako klinkem desnim klikom na folder, addFolder button ne daje parentId
    parentId:
      Object.keys(folderObject.folder).length > 0
        ? folderObject.folder.frontendId
        : "",
    depth: folderObject.folder.depth >= 0 ? folderObject.folder.depth + 1 : 0,
    new: true,
  };
  const newFolderWithFrontendId = {
    ...newFolder,
    frontendId: newFolder._id,
  };
  userProjects.addNewItem(newFolderWithFrontendId, newFolder.parentId);
  renderTotalNumberOfUserProjects();
  if (createMainFolder) reRenderAllFolderContainer();
};

const removableCreateFolderListener = (e: Event): void => {
  const target = e.target as HTMLElement;
  const isTargetNewFolder = target.closest("[newFolder]");

  if (isTargetNewFolder) {
  } else {
    if (defaultFolder.folderName === "New Folder") {
    } else {
      //ifSubfolderSetFolderObjectWithItsParentFolder();
      saveNewlyAddedFolder();
      projectStore.set("createNewFolder", false);
      window.removeEventListener("click", removableCreateFolderListener);
    }
  }
};

/*const ifSubfolderSetFolderObjectWithItsParentFolder = (): void => {
  if (folderObject.folder.parentId.length > 0) {
    loopThroughProjectArrayAndSetSelectedFolder(folderObject.folder.parentId);
  }
};*/

const saveNewlyAddedFolder = (): void => {
  const createNewFolder = projectStore.get("createNewFolder");
  const createMainFolder = projectStore.get("createMainFolder");
  const selectedFolderElement = projectStore.get(
    "selectedFolderElement"
  ) as HTMLElement;
  const parent = selectedFolderElement.parentNode?.parentNode as HTMLElement;

  if (createNewFolder) {
    if (createMainFolder) {
      userProjects.saveNewFolderItem(folderObject.folder.parentId, "folder");
      reRenderAllFolderContainer();
    } else {
      userProjects.saveNewFolderItem(folderObject.folder.parentId, "folder");
      closeSelectedFolder(parent);
      openSelectedFolder(parent);
    }
  }
};

// DELETING ITEMS ***************************************************************
// ˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘

const deleteFolder = (folder: FolderInterface, folderId: string): void => {
  const subfolderVisible = projectStore.get("subfolderVisible");
  const selectedFolderElement = projectStore.get(
    "selectedFolderElement"
  ) as HTMLElement;
  const parent = selectedFolderElement.parentNode?.parentNode as HTMLElement;
  if (folder._id === folderId) {
    userProjects.deleteFolder(folderObject.folder.frontendId, folder);
    projectService.deleteFolder(
      defaultUser.id,
      folderObject.folder.frontendId,
      folderObject.folder.depth
    );
    renderTotalNumberOfUserProjects();
    folderObject.setSelectedFolder({});
    if (subfolderVisible) {
      closeSelectedFolder(parent);
      openSelectedFolder(parent);
    } else {
      reRenderAllFolderContainer();
    }
  }
  if (folder.content.includes(folderId)) {
    userProjects.deleteFolder(folderId, folder);
  }
};

const reRenderSubfolder = (selectedFolderElement: HTMLElement) => {
  closeSelectedFolder(selectedFolderElement);
  openSelectedFolder(selectedFolderElement);
};

const rightClickMapForNotes = (subMenu: HTMLElement) => {
  subMenu.innerHTML = `
        <nav class="submenuNav">
          <ul> 
    <li class="deleteFolderLi"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15">
              <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
              </svg>
              Delete note</li>
          </ul>
        </nav>
        `;
};
