import globalStore from "../../Stores/GlobalStore";
import { monthYear } from "../../Utils/Date";

export const generateSidebar = (): HTMLElement => {
  if (!document.getElementById("sidebarStyling")) {
    const link = document.createElement("link");
    link.id = "sidebarStyling";
    link.rel = "stylesheet";
    link.href = "../../src/Components/Sidebar/sidebarStyling.css";

    document.head.appendChild(link);
  }

  const sidebar = document.createElement("div");

  sidebar.className = "sidebarStyles";
  sidebar.innerHTML = `
  <div class="sidebarDiv1">
  <svg class="sidebarSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="30">
  <path fill-rule="evenodd" d="M2.515 10.674a1.875 1.875 0 000 2.652L8.89 19.7c.352.351.829.549 1.326.549H19.5a3 3 0 003-3V6.75a3 3 0 00-3-3h-9.284c-.497 0-.974.198-1.326.55l-6.375 6.374zM12.53 9.22a.75.75 0 10-1.06 1.06L13.19 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L15.31 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z" clip-rule="evenodd" />
</svg>


      <div class="headerDiv1">
          <h2>All notes</h2>
      </div>
      <div class="headerDiv2">
          <h4 class="sidebarNotesLength"> notes</h4>
      </div>
      <div class="headerDiv3">
          <h5>${monthYear}</h5>
      </div>
  </div>
  
 
  
`;

  return sidebar;
};


