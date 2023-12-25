export const generateNewNotePopup = (): HTMLElement => {
  if (!document.getElementById("newNoteStyling")) {
    const link = document.createElement("link");
    link.id = "newNoteStyling";
    link.rel = "stylesheet";
    link.href =
      "../../src/Components/PopupWindows/NewNotePopup/newNoteStyling.css";

    document.head.appendChild(link);
  }

  const mainDiv = document.createElement("div");

  mainDiv.className = "newNotePopupStyles";
  mainDiv.innerHTML = `
    <div class="centralDiv">
    <button class="btn"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" data-slot="icon" width="30">
    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" />
  </svg>
</button> 
    <div class="selectExisting">
    <h3> Select folder </h3>
    <select class="folderSelect"> </select> <button class="addSelect"> Add note </button></div>
    

    </div>
    
  `;

  return mainDiv;
};