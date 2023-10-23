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
