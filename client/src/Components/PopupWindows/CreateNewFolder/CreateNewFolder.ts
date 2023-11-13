export const generateCreateNewFolder = (): HTMLElement => {
  if (!document.querySelector("createNewFolderStyling")) {
    const link = document.createElement("link");
    link.id = "createNewFolderStyling";
    link.rel = "stylesheet";
    link.href =
      "../../src/Components/PopupWindows/CreateNewFolder/newFolderStyling.css";

    document.head.appendChild(link);
  }

  const div = document.createElement("div");
  div.className = "newFolderDivMain";
  div.innerHTML = `
    <div class="newFolderDiv1">
    
      
        <button class="backSvg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="50">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      
        </button>
        
        <input class="newFolderInput" placeholder="Enter folder name" />
        
        
        <button class="addNewFolderButton">
            Add
        </button>
  
    </div>
  `;

  return div;
};
