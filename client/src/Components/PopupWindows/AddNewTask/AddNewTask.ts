export const generateAddNewTask = (): HTMLElement => {
  if (!document.querySelector("addNewTaskStyles")) {
    const link = document.createElement("link");
    link.id = "addNewTaskStyles";
    link.rel = "stylesheet";
    link.href =
      "../../src/Components/PopupWindows/AddNewTask/addNewTaskStyling.css";

    document.head.appendChild(link);
  }

  const div = document.createElement("div");
  div.className = "addNewTaskDivMain";
  div.innerHTML = `
  <div class="addNewTaskDiv1">
  
    
      <button class="backSvg">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="50">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
    
      </button>
      
      <input class="addNewInput" placeholder="Enter your task here" />
      
      
      <button class="addNewTaskButton">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
      </button>

  </div>
`;

  return div;
};
