import { generateNavbar } from "../../Components/Navbar/Navbar";
import { isSidebarVisible } from "../../Components/Sidebar/SidebarLogic";
import { isNoteEditorVisible } from "../../Components/NoteEditor/NoteEditorLogic";
import { navbarNavigationLogic } from "../../Components/Navbar/NavbarLogic";
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
import { isSelectColorVisible } from "../../Components/PopupWindows/SelectColor/SelectColorLogic";

document.getElementById("navbar-container")!.appendChild(generateNavbar()); // ovaj usklicnik prije appendchilda je to da ja govorim tsu da taj element nemre biti null jer je ts malo blesav
navbarNavigationLogic();

globalStore.subscribe("url", router.redirectToRoute);
globalStore.subscribe("sidebarVisible", isSidebarVisible);
globalStore.subscribe("noteEditorVisible", isNoteEditorVisible);
//globalStore.subscribe("deleteNote", findNoteIdToDeleteNote);
//globalStore.subscribe("existingNote", fetchExistingNote);
globalStore.subscribe("selectColorVisible", isSelectColorVisible);
globalStore.subscribe("loginVisible", isLoginVisible);
globalStore.subscribe("todoListVisible", isTodoListVisible);
globalStore.subscribe("activeLink", setActiveLinkCss);
globalStore.subscribe("homeVisible", isHomeVisible);

userStore.subscribe("isUserLoggedIn", isUserLoggedIn);

todoStore.subscribe("todoIndex", deleteTodoItem);

projectStore.subscribe("isCreateNewFolderVisible", isCreateNewFolderVisible);
projectStore.subscribe("selectedFolder", openSelectedFolder);
projectStore.subscribe("createNewFolder", isCreateNewFolderVisible);

/*window.addEventListener("beforeunload", function (e) {
  if (
    defaultNote.fetchedNoteText !== defaultNote.noteText ||
    defaultNote.fetchedNoteTitle !== defaultNote.noteTitle
  ) {
    e.preventDefault();
    e.returnValue = "";
  }
});*/

await userApiRequest.getUser();
if (defaultUser.id.length > 2)
  await projectService.fetchAllUserProjects(defaultUser.id);
if (window.location.pathname === "/") router.navigateTo("/home");
else router.getCurrentUrl();
