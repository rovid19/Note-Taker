import globalStore from "../Stores/GlobalStore";
import { setEditorsToTrueOrFalseAccordingly } from "./Utils";

class Router {
  routes: [];
  constructor(routes: []) {
    this.routes = routes;
  }

  getCurrentUrl() {
    const activeUrl = window.location.pathname;
    console.log(activeUrl);
    globalStore.set("url", activeUrl);
  }

  redirectToRoute() {
    const url = globalStore.get("url");
    console.log(url);
    switch (url) {
      case "/":
        setEditorsToTrueOrFalseAccordingly("/");
        break;
      case "/note":
        setEditorsToTrueOrFalseAccordingly("note");
        break;
      case "/dailytodo":
        setEditorsToTrueOrFalseAccordingly("dailytodo");
        break;
    }
  }

  navigateTo(pathname: string) {
    history.pushState(null, "", pathname);
    this.getCurrentUrl();
  }
}

/*export const isActiveUrl = (): void => {
 
};

export const checkForUrlChange = (): void => {
  const url = globalStore.get("url");
  if (url === "/") {
  } else if (url === "/todo-list") routerList.todoList.navigateToTodoList();
  else routerList.noteEditor.navigateToNoteEditor();
};

export const navigateTo = (pathname: string): void => {
 
};

export const extractIdFromUrl = (): string => {
  const url = window.location.href;
  return url;
};

export const isNoteEditorAndTodoOpenAtTheSameTime = (
  container: HTMLElement
): void => {
  const noteEditor = document.getElementById("note-container") as HTMLElement;
  const noteEditorVisible = globalStore.get("noteEditorVisible");
  const todoListVisible = globalStore.get("todoListVisible");

  if (container === noteEditor) {
    if (todoListVisible) {
      globalStore.set("todoListVisible", false);
    }
  } else {
    if (noteEditorVisible) {
      globalStore.set("noteEditorVisible", false);
    }
  }
};
*/

export const router = new Router([]);
