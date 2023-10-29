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

document.getElementById("navbar-container")!.appendChild(generateNavbar()); // ovaj usklicnik prije appendchilda je to da ja govorim tsu da taj element nemre biti null jer je ts malo blesav
navbarNavigationLogic();

globalStore.subscribe("url", isActiveUrl);
globalStore.subscribe("sidebarVisible", isSidebarVisible);
globalStore.subscribe("noteEditorVisible", isNoteEditorVisible);
globalStore.subscribe("deleteNote", findNoteIdToDeleteNote);
globalStore.subscribe("notesLength", reRenderNotesLengthElement);
globalStore.subscribe("existingNote", fetchExistingNote);

window.addEventListener("beforeunload", function (e) {
  console.log(defaultNote);
  if (
    defaultNote.fetchedNoteText !== defaultNote.noteText ||
    defaultNote.fetchedNoteTitle !== defaultNote.noteTitle
  ) {
    e.preventDefault();
    e.returnValue = "";
  }
});
isActiveUrl();
