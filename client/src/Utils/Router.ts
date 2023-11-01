import globalStore from "../Stores/GlobalStore";

type Routes = {
  url: string;
  navigateToTodoList?: any;
  navigateToNoteEditor?: any;
};

interface Router {
  home: Routes;
  [key: string]: Routes;
}

const routerList: Router = {
  home: {
    url: "/",
  },
  todoList: {
    url: "/todo-list",
    navigateToTodoList: () => globalStore.set("todoListVisible", true),
  },
  noteEditor: {
    url: "/notes",
    navigateToNoteEditor: () => globalStore.set("noteEditorVisible", true),
  },
};

export const isActiveUrl = (): void => {
  const activeUrl = window.location.pathname;
  globalStore.set("url", activeUrl);
  checkForUrlChange();
};

export const checkForUrlChange = (): void => {
  const url = globalStore.get("url");
  if (url === "/") {
  } else if (url === "/todo-list") routerList.todoList.navigateToTodoList();
  else routerList.noteEditor.navigateToNoteEditor();
};

export const navigateTo = (pathname: string): void => {
  history.pushState(null, "", pathname);
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
