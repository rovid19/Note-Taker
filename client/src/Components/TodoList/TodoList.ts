export const generateTodoList = (): HTMLElement => {
  if (!document.querySelector("todoListStyling")) {
    const link = document.createElement("link");
    (link.id = "todoListStyling"), (link.rel = "stylesheet");
    link.href = "../../src/Components/TodoList/todoListStyles.css";
    document.head.appendChild(link);
  }

  const div = document.createElement("div");
  div.className = "todoMainDiv";
  div.innerHTML = `
    <div class="todoInnerDiv1">
        <h1>Today</h1> <h2 class="h2">5</h2>
    </div>
    <div class="todoInnerDiv2">
  
    <button class="todoAddButton">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="30">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
        </svg> 
        Add new task
    </button> </div>
    <div class="todoInnerDiv3">
    
   
    </div>
`;

  return div;
};
