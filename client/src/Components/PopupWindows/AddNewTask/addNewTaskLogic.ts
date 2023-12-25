import { todoService } from "../../../Services/TodoService";
import { todoList } from "../../../Stores/TodoStore";
import { defaultUser } from "../../../Stores/UserStore";
import { generateRandomId } from "../../../Utils/GeneralFunctions";
import { TodoItem } from "../../../Utils/TsTypes";
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
  let todoItem = {
    name: "",
    isDone: false,
    timeSpent: 0,
    frontendId: generateRandomId(12),
  };

  closeNewTask.addEventListener("click", (): void => {
    closeAddNewTask();
  });

  inputElement.addEventListener("input", (e: Event): void => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    todoItem.name = value;
  });

  addNewTask.addEventListener("click", (): void => {
    todoList.addItem(todoItem);
    closeAddNewTask();
    mapOverTodoItems();
    saveItemToDatabase(todoItem);
  });
};

const focustInputElementWhenOpen = (): void => {
  const inputElement = document.querySelector(".addNewInput") as HTMLElement;
  inputElement.focus();
};

const saveItemToDatabase = (todoItem: TodoItem): void => {
  todoService.createItem(defaultUser.id, todoItem);
};
