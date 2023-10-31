import { generateNavbar } from "../../Components/Navbar/Navbar";
import { isSidebarVisible } from "../../Components/Sidebar/SidebarLogic";
import {
  fetchExistingNote,
  isNoteEditorVisible,
  findNoteIdToDeleteNote,
} from "../../Components/NoteEditor/NoteEditorLogic";
import { navbarNavigationLogic } from "../../Components/Navbar/NavbarLogic";
import globalStore from "../../Stores/GlobalStore";
import { isActiveUrl } from "../../Utils/Router";
import { reRenderNotesLengthElement } from "../../Components/Sidebar/SidebarLogic";
import { defaultNote } from "../../Components/NoteEditor/NoteEditor";
import {
  isLoginVisible,
  isUserLoggedIn,
  switchEventListeners,
} from "../../Components/UserAuth/UserAuthLogic";
import { userStore } from "../../Stores/UserStore";
import { userApiRequest } from "../../Services/UserService";

document.getElementById("navbar-container")!.appendChild(generateNavbar()); // ovaj usklicnik prije appendchilda je to da ja govorim tsu da taj element nemre biti null jer je ts malo blesav
navbarNavigationLogic();

globalStore.subscribe("url", isActiveUrl);
globalStore.subscribe("sidebarVisible", isSidebarVisible);
globalStore.subscribe("noteEditorVisible", isNoteEditorVisible);
globalStore.subscribe("deleteNote", findNoteIdToDeleteNote);
globalStore.subscribe("notesLength", reRenderNotesLengthElement);
globalStore.subscribe("existingNote", fetchExistingNote);
globalStore.subscribe("loginVisible", isLoginVisible);
//globalStore.subscribe("loginOrRegister", switchEventListeners);

userStore.subscribe("isUserLoggedIn", isUserLoggedIn);

window.addEventListener("beforeunload", function (e) {
  if (
    defaultNote.fetchedNoteText !== defaultNote.noteText ||
    defaultNote.fetchedNoteTitle !== defaultNote.noteTitle
  ) {
    e.preventDefault();
    e.returnValue = "";
  }
});
isActiveUrl();
userApiRequest.getUser();
