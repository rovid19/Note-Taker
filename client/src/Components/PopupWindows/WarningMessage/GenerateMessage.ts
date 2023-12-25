export const generateMessage = (warningMessage: string): HTMLElement => {
  if (!document.querySelector("warningStyles")) {
    const link = document.createElement("link");
    link.id = "warningStyles";
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href =
      "../../src/Components/PopupWindows/WarningMessage/warningStyling.css";

    document.head.appendChild(link);
  }

  const div = document.createElement("div");
  div.className = "warningDivMain";
  div.innerHTML = `
 
  <div class="warningDiv1"> <h3> ${warningMessage} </h3> </div>
  <div class="warningDiv2"> <button class="warningButton1"> Yes </button> <button class="warningButton2"> No </button> </div>
 
  `;

  return div;
};
