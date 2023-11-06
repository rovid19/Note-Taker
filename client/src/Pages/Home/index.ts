import { generateNavbar } from "../../Components/Navbar/Navbar";
import { isSidebarVisible } from "../../Components/Sidebar/SidebarLogic";
import {
  fetchExistingNote,
  isNoteEditorVisible,
  findNoteIdToDeleteNote,
} from "../../Components/NoteEditor/NoteEditorLogic";
import { navbarNavigationLogic } from "../../Components/Navbar/NavbarLogic";
import globalStore from "../../Stores/GlobalStore";
import { router } from "../../Utils/Router";
import { reRenderNotesLengthElement } from "../../Components/Sidebar/SidebarLogic";
import { defaultNote } from "../../Components/NoteEditor/NoteEditor";
import {
  isLoginVisible,
  isUserLoggedIn,
} from "../../Components/UserAuth/UserAuthLogic";
import { userStore } from "../../Stores/UserStore";
import { userApiRequest } from "../../Services/UserService";
import {
  deleteTodoItem,
  isTodoListVisible,
} from "../../Components/TodoList/TodoListLogic";
import { todoStore } from "../../Stores/TodoStore";
import { setActiveLinkCss } from "../../Utils/Utils";

document.getElementById("navbar-container")!.appendChild(generateNavbar()); // ovaj usklicnik prije appendchilda je to da ja govorim tsu da taj element nemre biti null jer je ts malo blesav
navbarNavigationLogic();

globalStore.subscribe("url", router.redirectToRoute);
globalStore.subscribe("sidebarVisible", isSidebarVisible);
globalStore.subscribe("noteEditorVisible", isNoteEditorVisible);
globalStore.subscribe("deleteNote", findNoteIdToDeleteNote);
globalStore.subscribe("notesLength", reRenderNotesLengthElement);
globalStore.subscribe("existingNote", fetchExistingNote);
globalStore.subscribe("loginVisible", isLoginVisible);
globalStore.subscribe("todoListVisible", isTodoListVisible);
globalStore.subscribe("activeLink", setActiveLinkCss);

userStore.subscribe("isUserLoggedIn", isUserLoggedIn);

todoStore.subscribe("todoIndex", deleteTodoItem);

window.addEventListener("beforeunload", function (e) {
  if (
    defaultNote.fetchedNoteText !== defaultNote.noteText ||
    defaultNote.fetchedNoteTitle !== defaultNote.noteTitle
  ) {
    e.preventDefault();
    e.returnValue = "";
  }
});

userApiRequest.getUser();

router.getCurrentUrl();
