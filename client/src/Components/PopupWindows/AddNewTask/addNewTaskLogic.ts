import { todoService } from "../../../Services/TodoService";
import { todoList } from "../../../Stores/TodoStore";
import { defaultUser } from "../../../Stores/UserStore";
import { mapOverTodoItems } from "../../TodoList/TodoListLogic";
import { generateAddNewTask } from "./AddNewTask";

export const createAddNewTask = (): void => {
  const div = document.createElement("div");
  div.className = "addnewtask-container";
  document.body.appendChild(div).appendChild(generateAddNewTask());
  addNewTaskEventListener();
  focustInputElementWhenOpen();
};

export const closeAddNewTask = (): void => {
  const addNewTaskContainer = document.querySelector(".addnewtask-container");
  addNewTaskContainer?.remove();
};

const addNewTaskEventListener = (): void => {
  const closeNewTask = document.querySelector(".backSvg") as HTMLElement;
  const inputElement = document.querySelector(".addNewInput") as HTMLElement;
  const addNewTask = document.querySelector(".addNewTaskButton") as HTMLElement;
  let inputValue = "";

  closeNewTask.addEventListener("click", (): void => {
    closeAddNewTask();
  });

  inputElement.addEventListener("input", (e: Event): void => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    inputValue = value;
  });

  addNewTask.addEventListener("click", (): void => {
    todoList.addItem(inputValue);
    closeAddNewTask();
    mapOverTodoItems();
    saveItemToDatabase(inputValue);
  });
};

const focustInputElementWhenOpen = (): void => {
  const inputElement = document.querySelector(".addNewInput") as HTMLElement;
  inputElement.focus();
};

const saveItemToDatabase = (inputValue: string): void => {
  todoService.saveItem(defaultUser.id, inputValue);
};
