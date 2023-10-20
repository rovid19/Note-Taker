import globalStore from "../Stores/GlobalStore";

export const navbarNavigationLogic = (): void => {
  const allNotesLi = document.querySelector(".allNotesLi") as HTMLElement; // stavljanje as HTMLElement je moje obecanje tsu da je to UVIJEK html element!
  const todoListLi = document.querySelector(".todoListLi") as HTMLElement;
  const loginLi = document.querySelector(".loginLi") as HTMLElement;

  addEventListenerForEachNavItem(allNotesLi, "allNotes");
  addEventListenerForEachNavItem(todoListLi, "todoList");
};

const addEventListenerForEachNavItem = (
  li: HTMLElement,
  value: string
): void => {
  li.addEventListener("click", (): void => {
    globalStore.set("subPage", value);
  });
};
