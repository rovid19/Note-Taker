import { generateNavbar } from "../../Components/Navbar/Navbar";
import { navbarNavigationLogic } from "../../Utils/NavbarNavigationLogic";
import globalStore from "../../Stores/GlobalStore";
console.log("Script loaded");

document.getElementById("navbar-container")!.appendChild(generateNavbar()); // ovaj usklicnik prije appendchilda je to da ja govorim tsu da taj element nemre biti null jer je ts malo blesav

navbarNavigationLogic();

console.log(globalStore.state);
