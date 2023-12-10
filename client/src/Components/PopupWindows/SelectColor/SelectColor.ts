export const generateSelectColor = (): HTMLElement => {
  const div = document.createElement("div");
  div.className = "selectColor";
  div.innerHTML = `
      <div class="color1"> </div>
      <div class="color2"> </div>
      <div class="color3"> </div>
      <div class="color4"> </div>
      <div class="color5"> </div>
      <div class="color6"> </div>
    `;

  return div;
};
