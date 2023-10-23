import { generateNavbar } from "../../Components/Navbar/Navbar";
import { isNoteEditorVisible, isSidebarVisible } from "../../Utils/NavbarLogic";
import { navbarNavigationLogic } from "../../Utils/NavbarLogic";
import globalStore from "../../Stores/GlobalStore";
import { isActiveUrl } from "../../Utils/Router";

document.getElementById("navbar-container")!.appendChild(generateNavbar()); // ovaj usklicnik prije appendchilda je to da ja govorim tsu da taj element nemre biti null jer je ts malo blesav
navbarNavigationLogic();

globalStore.subscribe("url", isActiveUrl);
globalStore.subscribe("sidebarVisible", isSidebarVisible);
globalStore.subscribe("noteEditorVisible", isNoteEditorVisible);

isActiveUrl();
