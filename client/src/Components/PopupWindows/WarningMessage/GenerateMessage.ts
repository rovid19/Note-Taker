export const generateMessage = (warningMessage: string): HTMLElement => {
  const div = document.createElement("div");
  div.className = "warningDivMain";
  div.innerHTML = `
 
  <div class="warningDiv1"> <h3> ${warningMessage} </h3> </div>
  <div class="warningDiv2"> <button class="warningButton1"> Yes </button> <button class="warningButton2"> No </button> </div>
 
  `;

  return div;
};
