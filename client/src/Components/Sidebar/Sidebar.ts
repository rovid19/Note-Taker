import globalStore from "../../Stores/GlobalStore";
import { monthYear } from "../../Utils/Date";

export const generateSidebar = (): HTMLElement => {
  if (!document.getElementById("sidebarStyling")) {
    const link = document.createElement("link");
    link.id = "sidebarStyling";
    link.rel = "stylesheet";
    link.href = "../../src/Components/Sidebar/sidebarStyling.css";

    document.head.appendChild(link);
  }

  const sidebar = document.createElement("div");

  sidebar.className = "sidebarStyles";
  sidebar.innerHTML = `
  <div class="sidebarDiv1">
  <svg class="sidebarSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="30">
  <path fill-rule="evenodd" d="M2.515 10.674a1.875 1.875 0 000 2.652L8.89 19.7c.352.351.829.549 1.326.549H19.5a3 3 0 003-3V6.75a3 3 0 00-3-3h-9.284c-.497 0-.974.198-1.326.55l-6.375 6.374zM12.53 9.22a.75.75 0 10-1.06 1.06L13.19 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L15.31 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z" clip-rule="evenodd" />
</svg>


      <div class="headerDiv1">
          <h2>All notes</h2>
      </div>
      <div class="headerDiv2">
          <h4 class="sidebarNotesLength"> notes</h4>
      </div>
      <div class="headerDiv3">
          <h5>${monthYear}</h5>
      </div>
  </div>
  
 
  
`;

  return sidebar;
};

interface Note {
  title: string;
  noteText: string;
  dateCreated: string;
}

export const mapOverAllNotes = (): void => {
  const userNotes = globalStore.get("userNotes") as unknown as Note[];
  const div = document.createElement("div");
  div.className = "sidebarDiv2";
  const sidebarStyles = document.querySelector(".sidebarStyles") as HTMLElement;
  userNotes.map((note) => {
    return (div.innerHTML += `
    <article class="sidebarArticle">
    <div class="articleSvg">
    <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20">
  <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
</svg></div>

    <div class="articleInnerDiv1">
    <h2 > ${note.title} </h2>
    </div>
    <div class="articleInnerDiv2">
    <h4> ${note.noteText} </h4>
    </div>
    <div class="articleInnerDiv3">
    <h6> ${note.dateCreated} </h6>
    </div>
    </article`);
  });

  sidebarStyles.appendChild(div);
  const articleSvg = document.querySelectorAll(".articleSvg");
  const sidebarDiv2 = document.querySelector(".sidebarDiv2");

  sidebarDiv2?.addEventListener("click", (event: Event): void => {
    const target = event.target as SVGSVGElement;
    const parentElement = target.closest(".articleSvg");
    const allSvgs = document.querySelectorAll(".articleSvg");
    if (parentElement) {
      const array = [...allSvgs];
      array.findIndex((item, i) => {
        if (item === parentElement) {
          globalStore.set("deleteNote", i);
        }
      });
    }
  });
};

export const getUserNotesLength = (): void => {
  const noteLength = globalStore.get("userNotes").length;
  globalStore.set("notesLength", noteLength);
};

export const reRenderNotesLengthElement = (): void => {
  const noteLengthElement = document.querySelector(
    ".sidebarNotesLength"
  ) as HTMLElement;

  noteLengthElement.textContent = `${globalStore.get(
    "notesLength"
  )} notes` as string;
};
