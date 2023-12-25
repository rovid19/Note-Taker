import { generateNavbar } from "../../Components/Navbar/Navbar";
import { isSidebarVisible } from "../../Components/Sidebar/SidebarLogic";
import { isNoteEditorVisible } from "../../Components/NoteEditor/NoteEditorLogic";
import {
  navbarNavigationLogic,
  setSearchActiveAccordingToSearchInput,
} from "../../Components/Navbar/NavbarLogic";
import globalStore from "../../Stores/GlobalStore";
import { router } from "../../Utils/Router/Router";

import {
  isLoginVisible,
  isUserLoggedIn,
} from "../../Components/UserAuth/UserAuthLogic";
import { defaultUser, userStore } from "../../Stores/UserStore";
import { userApiRequest } from "../../Services/UserService";
import {
  deleteTodoItem,
  isTodoListVisible,
} from "../../Components/TodoList/TodoListLogic";
import { todoStore } from "../../Stores/TodoStore";
import { setActiveLinkCss } from "../../Utils/Router/RouterLogic";
import { isHomeVisible } from "../../Components/Home/HomeLogic";
import { projectStore } from "../../Stores/ProjectStore";
import {
  isCreateNewFolderVisible,
  openSelectedFolder,
} from "../../Components/Sidebar/SidebarFolderLogic";
import { projectService } from "../../Services/ProjectService";
import { isSelectColorVisible } from "../../Components/PopupWindows/EditingButtons/SelectColorLogic";
import { isNewNotePopupVisible } from "../../Components/PopupWindows/NewNotePopup/NewNoteLogic";
import { io } from "socket.io-client";
import { isLoaderVisible } from "../../Components/PopupWindows/Loader/LoaderLogic";
import { loaderAnimation } from "../../Utils/GeneralFunctions";

document.getElementById("navbar-container")!.appendChild(generateNavbar()); // ovaj usklicnik prije appendchilda je to da ja govorim tsu da taj element nemre biti null jer je ts malo blesav
navbarNavigationLogic();

globalStore.subscribe("url", router.redirectToRoute);
globalStore.subscribe("sidebarVisible", isSidebarVisible);
globalStore.subscribe("noteEditorVisible", isNoteEditorVisible);
globalStore.subscribe("selectColorVisible", isSelectColorVisible);
globalStore.subscribe("loginVisible", isLoginVisible);
globalStore.subscribe("todoListVisible", isTodoListVisible);
globalStore.subscribe("activeLink", setActiveLinkCss);
globalStore.subscribe("homeVisible", isHomeVisible);
globalStore.subscribe("newNotePopupVisible", isNewNotePopupVisible);
globalStore.subscribe("loaderVisible", isLoaderVisible);

userStore.subscribe("isUserLoggedIn", isUserLoggedIn);
todoStore.subscribe("todoIndex", deleteTodoItem);

projectStore.subscribe("isCreateNewFolderVisible", isCreateNewFolderVisible);
projectStore.subscribe("selectedFolder", openSelectedFolder);
projectStore.subscribe("createNewFolder", isCreateNewFolderVisible);
projectStore.subscribe("searchInput", setSearchActiveAccordingToSearchInput);

/*window.addEventListener("beforeunload", function (e) {
  if (
    defaultNote.fetchedNoteText !== defaultNote.noteText ||
    defaultNote.fetchedNoteTitle !== defaultNote.noteTitle
  ) {
    e.preventDefault();
    e.returnValue = "";
  }
});*/
//const socket = io("http://localhost:3000");
const socket = io("http://note-editor-api.up.railway.app");
socket.on("connect", () => {
  console.log("Connected to the server");
});
socket.on("userFolders", (userFoldersLength) => {
  projectStore.set("userFolders", userFoldersLength);
});
socket.on("processedFolder", () => {
  loaderAnimation();
});

const getUser = async () => {
  await userApiRequest.getUser();
};
const fetchProjects = async () => {
  await projectService.fetchAllUserProjects(defaultUser.id);
};
const loginUser = async () => {
  await userApiRequest.loginUser("DemoAccount", "123123");
};
getUser();

if (defaultUser.id.length > 2) {
  socket.emit("register", defaultUser.id);
  fetchProjects();
} else {
  loginUser();
  socket.emit("register", defaultUser.id);
  fetchProjects();
}
if (window.location.pathname === "/") router.navigateTo("/home");
else router.getCurrentUrl();
