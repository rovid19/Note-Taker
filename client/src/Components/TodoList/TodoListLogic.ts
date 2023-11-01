import globalStore from "../../Stores/GlobalStore";
import { isNoteEditorAndTodoOpenAtTheSameTime } from "../../Utils/Router";
import { generateTodoList } from "./TodoList";

export const isTodoListVisible = (): void => {
  const todoListVisible = globalStore.get("todoListVisible");

  if (todoListVisible) {
    createTodoList();
    const todoList = document.querySelector(".todo-container") as HTMLElement;
    isNoteEditorAndTodoOpenAtTheSameTime(todoList);
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
