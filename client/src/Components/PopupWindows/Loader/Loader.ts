export const generateLoader = (): HTMLElement => {
  const div = document.createElement("div");
  div.className = "loaderMain";
  div.innerHTML = `
  <h1> Loading user data... </h1>
     <div class="loader">
      <div class="loaderAfter"> </div>
      </div>
    `;

  return div;
};
