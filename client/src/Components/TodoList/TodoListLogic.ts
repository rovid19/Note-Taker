import globalStore from "../../Stores/GlobalStore";
import { createAddNewTask } from "../PopupWindows/AddNewTask/addNewTaskLogic";
import { generateTodoList } from "./TodoList";
import { todoList, todoStore } from "../../Stores/TodoStore";
import { todoService } from "../../Services/TodoService";
import { TodoItem } from "../../Utils/TsTypes";

export const isTodoListVisible = (): void => {
  const todoListVisible = globalStore.get("todoListVisible");
  if (todoListVisible) {
    createTodoList();
    mapOverTodoItems();
    todoEventListeners();
  } else {
    const todoContainer = document.querySelector(
      ".todo-container"
    ) as HTMLElement;
    todoContainer.remove();
  }
};

const createTodoList = (): void => {
  const todoContainer = document.createElement("div");
  todoContainer.className = "todo-container";
  document.body.appendChild(todoContainer).appendChild(generateTodoList());
};

const todoEventListeners = (): void => {
  const addNewTaskBtn = document.querySelector(".todoAddButton") as HTMLElement;

  addNewTaskBtn.addEventListener("click", (): void => {
    createAddNewTask();
  });
};

export const mapOverTodoItems = (): void => {
  const todoListArray = todoList.todoList;
  const todoDiv = document.querySelector(".todoInnerDiv3") as HTMLElement;
  todoDiv.innerHTML = "";
  todoListArray.forEach((item: TodoItem) => {
    if (item.name) {
      todoDiv.innerHTML += `
      <article class="todoArticle" data-id=${item.frontendId} id=${
        item.isDone && "done"
      }>
          <svg class="blank" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="30">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
          </svg>
          ${item.name}
          <div class="todoButtonDiv">
           
             
              ${
                !item.isDone
                  ? `<button class="todoButtonDone"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
             </button>`
                  : `<button class="btnFiller"> </button>`
              }  <button class="todoButtonDelete">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
          </button>
          </div>
      </article>
      `;
    }
  });

  if (!todoDiv.getAttribute("data")) {
    todoItemsEventDelegation();
  }
  reRenderTodoListLengthElement();
};

const todoItemsEventDelegation = (): void => {
  const todoDiv = document.querySelector(".todoInnerDiv3") as HTMLElement;
  todoDiv.setAttribute("data", "eventListener");

  todoDiv.addEventListener("click", async (e: Event) => {
    const target = e.target as Element;
    const isDeleteButtonSelected = target.closest(
      ".todoButtonDelete"
    ) as HTMLElement;
    const isCompleteButtonSelected = target.closest(
      ".todoButtonDone"
    ) as HTMLElement;
    const parentElement = target.closest(".todoArticle") as HTMLElement;
    const allArticles = document.querySelectorAll(".todoArticle");
    if (isDeleteButtonSelected) {
      setIndexToDeleteItemFromTodo(allArticles, parentElement);
    } else if (isCompleteButtonSelected) {
      e.stopPropagation();
      const todoSave = todoStore.get("todoSave") as boolean;
      if (!todoSave) {
        let itemId = parentElement.getAttribute("data-id");
        let todoItem = {} as TodoItem;
        todoList.todoList.forEach((item) => {
          if (item.frontendId === itemId) {
            item.isDone = true;
            todoItem = item;
          }
        });
        mapOverTodoItems();
        await todoService.saveItem(todoItem);
      } else {
        alert("yo");
      }
    }
  });
};

const setIndexToDeleteItemFromTodo = (
  allArticles: NodeListOf<Element>,
  parentElement: HTMLElement
): void => {
  allArticles.forEach((item, i) => {
    if (item === parentElement) {
      todoStore.set("todoIndex", i);
    }
  });
};
const calculateTodoListLength = (): string => {
  const todoListLength = todoList.todoList.length.toString();

  return todoListLength;
};

const reRenderTodoListLengthElement = (): void => {
  const lengthElement = document.querySelector(".h2") as HTMLElement;

  lengthElement.textContent = calculateTodoListLength();
};

export const deleteTodoItem = async () => {
  const todoIndex = todoStore.get("todoIndex") as number;
  if (todoIndex !== null) {
    const todoItemDeleteId = todoList.todoList[todoIndex]._id as string;
    todoList.deleteTodoItem(todoIndex);
    mapOverTodoItems();
    await todoService.deleteTask(todoItemDeleteId);
    todoStore.set("todoIndex", null);
  }
};
