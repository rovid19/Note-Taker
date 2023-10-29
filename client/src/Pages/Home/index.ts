import { generateNavbar } from "../../Components/Navbar/Navbar";
import { isSidebarVisible } from "../../Components/Sidebar/SidebarLogic";
import {
  fetchExistingNote,
  isNoteEditorVisible,
  setNoteIdToDeleteNote,
} from "../../Components/NoteEditor/NoteEditorLogic";
import { navbarNavigationLogic } from "../../Components/Navbar/NavbarLogic";
import globalStore from "../../Stores/GlobalStore";
import { isActiveUrl } from "../../Utils/Router";
import { reRenderNotesLengthElement } from "../../Components/Sidebar/SidebarLogic";

document.getElementById("navbar-container")!.appendChild(generateNavbar()); // ovaj usklicnik prije appendchilda je to da ja govorim tsu da taj element nemre biti null jer je ts malo blesav
navbarNavigationLogic();

globalStore.subscribe("url", isActiveUrl);
globalStore.subscribe("sidebarVisible", isSidebarVisible);
globalStore.subscribe("noteEditorVisible", isNoteEditorVisible);
globalStore.subscribe("deleteNote", setNoteIdToDeleteNote);
globalStore.subscribe("notesLength", reRenderNotesLengthElement);
globalStore.subscribe("existingNote", fetchExistingNote);

isActiveUrl();
