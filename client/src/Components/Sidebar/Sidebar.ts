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
          <h2>All projects</h2>
      </div>
      <div class="headerDiv2">
          <h4 class="sidebarNotesLength"> projects</h4>
          <div class="sidebarButtons">
          <button class="addFolderSvg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20">
          <path fill-rule="evenodd" d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm-6.75-10.5a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V10.5z" clip-rule="evenodd" />
        </svg>
        
         </button>
          <button class="filterSvg"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20">
          <path fill-rule="evenodd" d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z" clip-rule="evenodd" />
        </svg>
        
         </button>
        </div>
         
      </div>
      <div class="headerDiv3">
          <h5>${monthYear}</h5>
      </div>
  </div>
  
 
  
`;

  return sidebar;
};
