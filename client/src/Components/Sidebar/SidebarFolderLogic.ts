import { projectStore } from "../../Stores/ProjectStore";
import { defaultFolder } from "../../Stores/ProjectStore";
import globalStore from "../../Stores/GlobalStore";
import { FolderInterface } from "../../Utils/TsTypes";
import { userProjects } from "../../Stores/ProjectStore";
import { addIcon, generateRandomId } from "../../Utils/GeneralFunctions";
import { fullDate } from "../../Utils/Date";
import { reRenderAllFolderContainer } from "./SidebarLogic";
import { projectService } from "../../Services/ProjectService";
import { defaultUser } from "../../Stores/UserStore";

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
      projectStore.set("isCreateNewFolderVisible", true);
    } else if (isParentFolder) {
      /*autoSaveNote();
        setNoteIdToOpenNote(allArticles, parentElementOpen);
        const noteId = noteStore.get("noteId");
        router.navigateTo(`/notes/noteId=${noteId}`);
        noteStore.set("existingNote", true);
        globalStore.set("noteEditorVisible", true);*/

      const selectedFolder = selectFolder(allArticles, isParentFolder);
      isFolderOpenOrClosed(selectedFolder);
    }
  });
  sidebarDiv2?.addEventListener("contextmenu", (e: Event): void => {
    e.preventDefault();

    const target = e.target as HTMLElement;
    const parentElementArticle = target.closest(".sidebarArticle") as Element;
    const isParentFolder = target.closest("[data-id]") as HTMLElement;

    if (parentElementArticle) {
      closeRightClickMenuIfOpen();
      selectFolder(allArticles, isParentFolder);
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
      defaultFolder.setNewFolderTitle(target.value);
    });
  }
};

// SELECTING FOLDER WHEN CLICKING OR RIGHT CLICKING *******************************
// ˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘
const selectFolder = (
  allFolders: NodeListOf<Element>,
  isParentFolder: HTMLElement
): HTMLElement => {
  const array = [...allFolders];
  let selectedFolderElement = {} as HTMLElement;
  if (isParentFolder) {
    array.forEach((folder) => {
      if (folder === isParentFolder) {
        selectedFolderElement = folder as HTMLElement;
        const folderId = isParentFolder.dataset.id as string;
        loopThroughProjectArrayAndSetSelectedFolder(folderId);
      }
    });
  }

  return selectedFolderElement;
};

const isFolderOpenOrClosed = (selectedFolder: HTMLElement): void => {
  if (selectedFolder.id === "opened") closeSelectedFolder(selectedFolder);
  else openSelectedFolder(selectedFolder);
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

const closeSelectedFolder = (selectedFolder: HTMLElement): void => {
  const elementIcon = selectedFolder.querySelector(".svgHolder") as HTMLElement;
  elementIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  `;
  selectedFolder.id = "";
  const selectedFolderSubmenu = selectedFolder.querySelector(
    ".folderSubmenu"
  ) as HTMLElement;

  if (selectedFolderSubmenu) selectedFolderSubmenu.remove();
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
    } else if (folder._id === folderId) {
      if (purpose === "newFolder") {
        newFolder = folder;
      } else if (purpose === "openCloseFolder") {
        setSelectedFolder(folder);
      }
    } else {
      if (folder.content.length > 0)
        loopThroughArray(folder.content, folderId, purpose);
    }
  }
  return newFolder;
};

const setSelectedFolder = (folder: FolderInterface): void => {
  defaultFolder.selectedFolder(
    folder.name,
    folder._id,
    "",
    folder.depth,
    folder.content
  );
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
      projectStore.set("subFolderVisible", true);
      const subMenu = document.createElement("div");
      subMenu.className = "subMenu";
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

      folder.appendChild(subMenu);
      rightClickMenuEventListeners();
    }
  });
};

const rightClickMenuEventListeners = (): void => {
  const submenu = document.querySelector(".subMenu") as HTMLElement;

  submenu.addEventListener("click", (e: Event): void => {
    const target = e.target as HTMLElement;
    const parentElementAddFolder = target.closest(".addSubFolderLi");
    const parentElementAddNote = target.closest(".addNoteLi");
    const parentElementAddTask = target.closest(".addTaskLi");

    if (parentElementAddFolder)
      projectStore.set("isCreateNewFolderVisible", true);
    else if (parentElementAddNote) globalStore.set("noteEditorVisible", true);
    else if (parentElementAddTask) globalStore.set("todoListVisible", true);
    else {
      console.log("ok");
      loopThroughArray(userProjects.projects, defaultFolder.folderId, "delete");
    }
  });
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
  const subFolderVisible = projectStore.get("subFolderVisible");
  if (subFolderVisible) {
    document.querySelector(".subMenu")?.remove();
    projectStore.set("subFolderVisible", false);
  }
};

// CREATING SUBFOLDERS AND ATTACHING ITS EVENT LISTENERS **************************
// ˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘
const createSelectedFolderSubmenu = (selectedFolder: HTMLElement): void => {
  const menu = document.createElement("div");
  menu.className = "folderSubmenu";

  defaultFolder.folderContent.map((item) => {
    menu.innerHTML += `
        <article class="submenuArticle" id=${item.type} data-id=${
      item._id
    }> <div class="articleInnerDiv1"> <div class="svgHolder">${addIcon(
      item
    )}</div> ${item.name} </article></div>
      `;
  });

  selectedFolder.appendChild(menu);
  const selectedFolderSubmenu = selectedFolder.querySelector(
    ".folderSubmenu"
  ) as HTMLElement;

  createDivIndent(selectedFolderSubmenu);
  subfolderEventDelegations(selectedFolderSubmenu);
};

const subfolderEventDelegations = (folder: HTMLElement): void => {
  const allSubfolders = folder.querySelectorAll(".submenuArticle");

  folder.addEventListener("click", (e: Event): void => {
    const target = e.target as HTMLElement;
    const isParentFolder = target.closest("[data-id]") as HTMLElement;

    if (isParentFolder) {
      e.stopPropagation();
      const selectedFolder = selectFolder(allSubfolders, isParentFolder);
      if (selectedFolder) isFolderOpenOrClosed(selectedFolder);
    }
  });

  folder.addEventListener("contextmenu", (e: Event): void => {
    const target = e.target as HTMLElement;
    const isParentFolder = target.closest("[data-id]") as HTMLElement;

    e.stopPropagation();
    e.preventDefault();
    selectFolder(allSubfolders, isParentFolder);
    createFolderRightClickMenu(isParentFolder, allSubfolders);
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
    userProjects.deleteFolder([], defaultFolder.folderId, {});
    projectService.addNewFolder(
      defaultUser.id,
      defaultFolder.folderName,
      "",
      fullDate
    );
    defaultFolder.selectedFolder("", "", "", 0, []);
    reRenderAllFolderContainer();
  }
};

export const createNewFolder = (): void => {
  const newFolder = {
    name: "New folder",
    dateCreated: fullDate,
    content: [],
    type: "folder",
    depth: defaultFolder.folderDepth,
    _id: generateRandomId(12),
    parentId: defaultFolder.folderId ? defaultFolder.folderId : "",
    new: true,
  };
  defaultFolder.selectedFolder(
    "New Folder",
    newFolder._id,
    newFolder.parentId,
    newFolder.depth,
    []
  );
  console.log(defaultFolder.folderId);
  projectStore.set("createNewFolder", true);
  userProjects.addNewFolder(newFolder, newFolder.parentId, "add");

  reRenderAllFolderContainer();
};

const removableCreateFolderListener = (e: Event): void => {
  const target = e.target as HTMLElement;
  const isTargetNewFolder = target.closest("[newFolder]");

  if (isTargetNewFolder) {
  } else {
    if (defaultFolder.folderName === "New Folder") {
    } else {
      saveNewlyAddedFolder();
      window.removeEventListener("click", removableCreateFolderListener);
      projectStore.set("createNewFolder", false);
    }
  }
};

const saveNewlyAddedFolder = (): void => {
  const createNewFolder = projectStore.get("createNewFolder");
  if (createNewFolder) {
    userProjects.addNewFolder(
      defaultFolder,
      defaultFolder.folderParentId,
      "save"
    );
    reRenderAllFolderContainer();
  }
};

// DELETING FOLDER ***************************************************************
// ˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘˘

const deleteFolder = (folder: FolderInterface, folderId: string): void => {
  if (folder._id === folderId) {
    userProjects.deleteFolder([], folderId, folder);
    reRenderAllFolderContainer();
  }
  if (folder.content.includes(folderId)) {
    userProjects.deleteFolder(folder.content, folderId, folder);
  }
};
