import globalStore from "../../Stores/GlobalStore";
import { noteObject, noteStore } from "../../Stores/NoteStore";
import { router } from "./Router";

export const setComponentsToTrueOrFalseAccordingly = (
  component: string
): void => {
  const isNewNote = noteStore.get("isNewNote");
  const noteIdFromUrl = noteStore.get("noteIdFromUrl");
  if (component.includes("/projects")) {
    if (window.location.search) {
      if (isNewNote) {
        setAppComponentsOnOff(true, false, false, true, "note");
      } else {
        const noteId = getNoteIdFromUrl();
        noteObject.setId(noteId);
        setAppComponentsOnOff(true, false, false, true, "note");
      }
    } else if (component === "/projects/dailytodo") {
      setAppComponentsOnOff(false, true, false, true, "todo");
    } else if (component === "/projects/home") {
      setAppComponentsOnOff(false, false, true, true, "home");
    } else {
      router.navigateTo("/projects/home");
    }
  } else {
    if (window.location.search || noteIdFromUrl) {
      if (noteIdFromUrl) {
        setAppComponentsOnOff(true, false, false, false, "note");
      }
      setAppComponentsOnOff(true, false, false, false, "note");
    } else if (component === "/dailytodo") {
      setAppComponentsOnOff(false, true, false, false, "todo");
    } else if (component === "/home") {
      setAppComponentsOnOff(false, false, true, false, "home");
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

const setAppComponentsOnOff = (
  note: boolean,
  todo: boolean,
  home: boolean,
  sidebar: boolean,
  activeLink: string
) => {
  globalStore.set("noteEditorVisible", note);
  globalStore.set("todoListVisible", todo);
  globalStore.set("homeVisible", home);
  globalStore.set("sidebarVisible", sidebar);
  globalStore.set("activeLink", activeLink);
};
