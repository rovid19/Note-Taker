export const generateNewNote = (): HTMLElement => {
  if (!document.querySelector("noteStyling")) {
    const link = document.createElement("link");
    link.id = "noteStyling";
    link.rel = "stylesheet";
    link.href = "../../src/Components/NoteEditor/noteStyling.css";

    document.head.appendChild(link);
  }

  const noteEditor = document.createElement("div");
  noteEditor.className = "newNoteStyles";
  noteEditor.innerHTML = `
  <div class="newNoteDiv1"> </div>
  <div class="newNoteDiv2">
    <h1> Meeting Notes </h1>
  </div>
  `;

  return noteEditor;
};
