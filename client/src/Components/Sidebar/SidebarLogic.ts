import globalStore from "../../Stores/GlobalStore";
import { generateSidebar } from "./Sidebar";
import { router } from "../../Utils/Router/Router";
import { extractProjectFromUrl } from "../../Utils/Router/RouterLogic";
import {
  defaultFolder,
  projectStore,
  userProjects,
} from "../../Stores/ProjectStore";
import { FolderInterface, Item } from "../../Utils/TsTypes";
import { fullDate } from "../../Utils/Date";
import { generateRandomId } from "../../Utils/GeneralFunctions";
import { projectService } from "../../Services/ProjectService";
import { defaultUser } from "../../Stores/UserStore";

export const isSidebarVisible = async () => {
  const sidebarVisible = globalStore.state.sidebarVisible;
  const noteEditorVisible = globalStore.state.noteEditorVisible;
  const todoListVisible = globalStore.get("todoListVisible") as boolean;
  const homeVisible = globalStore.get("homeVisible") as boolean;

  const todoOrNoteElement = whichEditorIsActive(
    noteEditorVisible,
    homeVisible
  ) as HTMLElement;

  if (sidebarVisible) {
    createSidebar(
      noteEditorVisible,
      todoOrNoteElement,
      todoListVisible,
      homeVisible
    );
    sidebarEventListeners();
    renderTotalNumberOfUserProjects();
    createAllFolderContainer();
    sidebarNavigationLogic();
  } else {
    document.getElementById("sidebar-container")?.remove();
    window.removeEventListener("click", closeRightClickMenuIfOpen);
    removeUrl();
  }
};

const removeUrl = (): void => {
  setTimeout(() => {
    const url = window.location.pathname;
    const newUrl = extractProjectFromUrl(url);
    window.history.replaceState({}, "", newUrl);
  }, 0);
};

const whichEditorIsActive = (
  noteEditorVisible: string | number | boolean,
  homeVisible: boolean
): HTMLElement => {
  return noteEditorVisible
    ? (document.getElementById("note-container") as HTMLElement)
    : homeVisible
    ? (document.querySelector(".home-container") as HTMLElement)
    : (document.querySelector(".todo-container") as HTMLElement);
};

export const sidebarNavigationLogic = (): void => {
  const closeSidebarSvg = document.querySelector(".sidebarSvg") as HTMLElement;

  //window.addEventListener("click", closeRightClickMenuIfOpen);

  closeSidebarSvg.addEventListener("click", () => {
    const url = window.location.pathname.replace("/projects", "");
    router.navigateTo(url);
  });
};

export const createAllFolderContainer = (): void => {
  const div = document.createElement("div");
  div.className = "sidebarDiv2";
  const sidebarStyles = document.querySelector(".sidebarStyles") as HTMLElement;
  mapOverAllUserProjects(userProjects.projects, div);
  sidebarStyles.appendChild(div);
  const sidebarDiv2 = document.querySelector(".sidebarDiv2") as HTMLElement;

  eventDelegationForProjects(sidebarDiv2);
};

export const reRenderAllFolderContainer = () => {
  document.querySelector(".sidebarDiv2")?.remove();
  createAllFolderContainer();
};

const mapOverAllUserProjects = (
  userFolders: FolderInterface[],
  div: HTMLElement
): void => {
  if (userFolders.length === 0) {
    createNewFolderButton(div);
  } else {
    userFolders.map((folder) => {
      return (div.innerHTML += `
      <article class="sidebarArticle" data-id=${folder._id} data-mainfolder=${
        folder._id
      }>  
        <div class="articleInnerDiv1">
          <div class="svgHolder"> 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          ${
            !folder.new
              ? `<h2 class="articleTitle" > ${folder.name} </h2>`
              : `<input class="addNewFolderInput" newFolder="new" placeholder="Enter new folder name"/>`
          }
         
        </div>
          
      </article>`);
    });
  }
};

const createNewFolderButton = (div: HTMLElement): void => {
  div.innerHTML += `
  <div class="noFolderDisplayDiv"> 
    <button class="createNewFolderBtn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
    Create new folder </button> 
  </div>
  `;
};

export const renderTotalNumberOfUserProjects = (): void => {
  const projectLengthElement = document.querySelector(
    ".sidebarNotesLength"
  ) as HTMLElement;
  const userProjectsLength = userProjects.projects.length;

  projectLengthElement.textContent = `${userProjectsLength} projects`;
};

const createSidebar = (
  noteEditorVisible: string | number | boolean,
  todoOrNoteElement: HTMLElement,
  todoListVisible: boolean,
  homeVisible: boolean
): void => {
  let div = document.createElement("div");
  div.id = "sidebar-container";
  if (noteEditorVisible) document.body.insertBefore(div, todoOrNoteElement);
  else if (homeVisible) document.body.insertBefore(div, todoOrNoteElement);
  else if (todoListVisible) document.body.insertBefore(div, todoOrNoteElement);
  else document.body.appendChild(div);
  document.getElementById("sidebar-container")?.appendChild(generateSidebar());
};

const eventDelegationForProjects = (sidebarDiv2: HTMLElement): void => {
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
      console.log(defaultFolder.folderName);
    });
  }
};

const selectFolder = (
  allFolders: NodeListOf<Element>,
  isParentFolder: HTMLElement
): HTMLElement => {
  const array = [...allFolders];
  let selectedFolderElement = {} as HTMLElement;
  if (isParentFolder) {
    array.forEach((folder, i) => {
      if (folder === isParentFolder) {
        selectedFolderElement = folder as HTMLElement;
        const folderId = isParentFolder.dataset.id as string;
        setFolderAccordinglyToMainFolder(i, folderId);
      }
    });
  }

  return selectedFolderElement;
};

const createFolderRightClickMenu = (
  isParentElementArticle: Element,
  allArticles: NodeListOf<Element>
): void => {
  const array = [...allArticles];
  array.forEach((folder, i) => {
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

const sidebarEventListeners = (): void => {
  const addFolder = document.querySelector(".addFolderSvg") as HTMLElement;

  addFolder.addEventListener("click", (): void => {
    projectStore.set("createNewFolder", true);
  });
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

const closeRightClickMenuIfOpen = (): void => {
  const subFolderVisible = projectStore.get("subFolderVisible");
  if (subFolderVisible) {
    document.querySelector(".subMenu")?.remove();
    projectStore.set("subFolderVisible", false);
  }
};

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
  //defaultFolder.selectedFolder("", "", []);
};

const subfolderEventDelegations = (folder: HTMLElement): void => {
  const allFolders = folder.querySelectorAll(".submenuArticle");

  folder.addEventListener("click", (e: Event): void => {
    const target = e.target as HTMLElement;
    const isParentFolder = target.closest("[data-id]") as HTMLElement;

    if (isParentFolder) {
      e.stopPropagation();
      const selectedFolder = selectFolder(allFolders, isParentFolder);
      if (selectedFolder) isFolderOpenOrClosed(selectedFolder);
    }
  });

  folder.addEventListener("contextmenu", (e: Event): void => {
    const target = e.target as HTMLElement;
    const isParentFolder = target.closest("[data-id]") as HTMLElement;

    e.stopPropagation();
    e.preventDefault();
    selectFolder(allFolders, isParentFolder);
    createFolderRightClickMenu(isParentFolder, allFolders);
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

const addIcon = (item: Item): string => {
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

const isFolderOpenOrClosed = (selectedFolder: HTMLElement): void => {
  if (selectedFolder.id === "opened") closeSelectedFolder(selectedFolder);
  else openSelectedFolder(selectedFolder);
};

export const setFolderAccordinglyToMainFolder = (
  i: number,
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
    if (folder._id === folderId) {
      if (purpose === "newFolder") {
        newFolder = folder;
      } else {
        defaultFolder.selectedFolder(
          folder.name,
          folder._id,
          "",
          folder.depth,
          folder.content
        );
      }
    } else {
      if (folder.content.length > 0)
        loopThroughArray(folder.content, folderId, purpose);
    }
  }
  return newFolder;
};
const createDivIndent = (selectedFolderSubmenu: HTMLElement): void => {
  const divIndent = document.createElement("div");
  divIndent.style.width = `${8 * defaultFolder.folderDepth}px`;
  divIndent.style.borderRight = "2px solid #404040";
  divIndent.className = "divIndent";
  selectedFolderSubmenu.appendChild(divIndent);
  attachDivIndentToAllSubfolders(selectedFolderSubmenu, divIndent);
};

const attachDivIndentToAllSubfolders = (
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

export const createNewFolder = (): void => {
  const newFolder = {
    name: "New folder",
    dateCreated: fullDate,
    content: [],
    type: "folder",
    depth: defaultFolder.folderDepth,
    id: generateRandomId(12),
    parentId: defaultFolder.folderId ? defaultFolder.folderId : "",
    new: true,
  };
  defaultFolder.selectedFolder(
    "New Folder",
    newFolder.id,
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

export const isCreateNewFolderVisible = (): void => {
  const createNewFolderVisible = projectStore.get("createNewFolder");
  if (createNewFolderVisible) {
    createNewFolder();
    window.addEventListener("click", removableCreateFolderListener);
  } else {
    window.removeEventListener("click", removableCreateFolderListener);
    userProjects.removeFolderFromProjects(defaultFolder.folderId);
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
