import globalStore from "../../Stores/GlobalStore";

export const setComponentsToTrueOrFalseAccordingly = (
  component: string
): void => {
  if (component.includes("/projects")) {
    if (component === "/projects/note") {
      globalStore.set("noteEditorVisible", true);
      globalStore.set("todoListVisible", false);
      globalStore.set("homeVisible", false);
      globalStore.set("sidebarVisible", true);
      globalStore.set("activeLink", "note");
    } else if (component === "/projects/dailytodo") {
      globalStore.set("todoListVisible", true);
      globalStore.set("noteEditorVisible", false);
      globalStore.set("homeVisible", false);
      globalStore.set("sidebarVisible", true);
      globalStore.set("activeLink", "todo");
    } else if (component === "/projects/") {
      globalStore.set("homeVisible", true);
      globalStore.set("noteEditorVisible", false);
      globalStore.set("todoListVisible", false);
      globalStore.set("sidebarVisible", true);
      globalStore.set("activeLink", "home");
    } else {
      globalStore.set("sidebarVisible", true);
    }
  } else {
    if (component === "/note") {
      globalStore.set("noteEditorVisible", true);
      globalStore.set("todoListVisible", false);
      globalStore.set("homeVisible", false);
      globalStore.set("sidebarVisible", false);
      globalStore.set("activeLink", "note");
    } else if (component === "/dailytodo") {
      globalStore.set("todoListVisible", true);
      globalStore.set("noteEditorVisible", false);
      globalStore.set("homeVisible", false);
      globalStore.set("sidebarVisible", false);
      globalStore.set("activeLink", "todo");
    } else if (component === "/") {
      globalStore.set("homeVisible", true);
      globalStore.set("noteEditorVisible", false);
      globalStore.set("todoListVisible", false);
      globalStore.set("sidebarVisible", false);
      globalStore.set("activeLink", "home");
    }
  }
};

export const setActiveLinkCss = (): void => {
  const activeLink = globalStore.get("activeLink");
  const homeLi = document.querySelector(".homeLi") as HTMLElement;
  const todoLi = document.querySelector(".todoListLi") as HTMLElement;
  if (activeLink === "home") {
    homeLi.style.backgroundColor = "#404040";
    todoLi.style.backgroundColor = "#262626";
  } else if (activeLink === "todo") {
    todoLi.style.backgroundColor = "#404040";
    homeLi.style.backgroundColor = "#262626";
  } else {
    todoLi.style.backgroundColor = "#262626";
    homeLi.style.backgroundColor = "#262626";
  }
};

export const extractProjectFromUrl = (url: string): string => {
  let newUrl = url.replace("/projects", "");

  return newUrl;
};

export const isComponentOpen = (): boolean => {
  const editorVisible = globalStore.get("editorVisible");
  const todoVisible = globalStore.get("todoVisible");
  const homeVisible = globalStore.get("homeVisible");
  const componentArray = [editorVisible, todoVisible, homeVisible];
  let isComponentVisible = componentArray.some((item) => item);

  return isComponentVisible;
};
