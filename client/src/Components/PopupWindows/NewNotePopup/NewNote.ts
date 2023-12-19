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

  mainDiv.className = "newNoteStyles";
  mainDiv.innerHTML = `
    <div class="centralDiv">
    <div class="selectExisting">
    <h3> Select in which folder you want to place your note </h3>
    <select class="folderSelect"> </select> </div>
    <div class="addNew">
    <h3> Add new folder in which your note will be placed </h3>
    <div class="input"> <input />  <button> Add </button></div>
    </div>

    </div>
    
  `;

  return mainDiv;
};
