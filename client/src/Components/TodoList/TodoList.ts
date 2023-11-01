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
    </button>
    <article class="todoArticle">
        <svg class="blank" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="30">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
        </svg>
        Blablabla
        <div class="todoButtonDiv">
            <button class="todoButtonDone">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            </button>
            <button class="todoButtonDelete">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
        </div>
    </article>
    </div>
`;

  return div;
};
