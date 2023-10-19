import { generateNavbar } from "../../Components/Navbar/Navbar";
import globalStore from "../../Stores/GlobalStore";
console.log("Script loaded");

document.getElementById("navbar-container").appendChild(generateNavbar());
