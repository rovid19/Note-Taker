import globalStore from "../Stores/GlobalStore";

export const setEditorsToTrueOrFalseAccordingly = (editor: string): void => {
  if (editor === "note") {
    globalStore.set("noteEditorVisible", true);
    globalStore.set("todoListVisible", false);
    globalStore.set("homeVisible", false);

    globalStore.set("activeLink", "note");
  } else if (editor === "dailytodo") {
    globalStore.set("todoListVisible", true);
    globalStore.set("noteEditorVisible", false);
    globalStore.set("homeVisible", false);

    globalStore.set("activeLink", "todo");
  } else if (editor === "/") {
    globalStore.set("homeVisible", true);
    globalStore.set("noteEditorVisible", false);
    globalStore.set("todoListVisible", false);

    globalStore.set("activeLink", "home");
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
