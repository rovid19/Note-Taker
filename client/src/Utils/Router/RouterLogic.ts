import globalStore from "../../Stores/GlobalStore";
import { noteObject, noteStore } from "../../Stores/NoteStore";
import { router } from "./Router";

export const setComponentsToTrueOrFalseAccordingly = (
  component: string
): void => {
  const isNewNote = noteStore.get("isNewNote");
  if (component.includes("/projects")) {
    if (window.location.search) {
      if (isNewNote) {
        globalStore.set("noteEditorVisible", true);
        globalStore.set("todoListVisible", false);
        globalStore.set("homeVisible", false);
        globalStore.set("sidebarVisible", true);
        globalStore.set("activeLink", "note");
      } else {
        const noteId = getNoteIdFromUrl();
        noteObject.setId(noteId);
        globalStore.set("noteEditorVisible", true);
        globalStore.set("todoListVisible", false);
        globalStore.set("homeVisible", false);
        globalStore.set("sidebarVisible", true);
        globalStore.set("activeLink", "note");
      }
    } else if (component === "/projects/dailytodo") {
      globalStore.set("todoListVisible", true);
      globalStore.set("noteEditorVisible", false);
      globalStore.set("homeVisible", false);
      globalStore.set("sidebarVisible", true);
      globalStore.set("activeLink", "todo");
    } else if (component === "/projects/home") {
      globalStore.set("homeVisible", true);
      globalStore.set("noteEditorVisible", false);
      globalStore.set("todoListVisible", false);
      globalStore.set("sidebarVisible", true);
      globalStore.set("activeLink", "home");
    } else {
      router.navigateTo("/projects/home");
    }
  } else {
    if (window.location.search) {
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
    } else if (component === "/home") {
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
  const todoVisible = globalStore.get("todoListVisible");
  const homeVisible = globalStore.get("homeVisible");
  const componentArray = [editorVisible, todoVisible, homeVisible];
  let isComponentVisible = componentArray.some((item) => item);

  return isComponentVisible;
};

const getNoteIdFromUrl = (): string => {
  const queryParams = new URLSearchParams(window.location.search);
  const noteId = queryParams.get("noteId") as string;

  return noteId;
};
