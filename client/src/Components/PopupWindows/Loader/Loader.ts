export const generateLoader = (): HTMLElement => {
  if (!document.querySelector("loaderStyling")) {
    const link = document.createElement("link");
    link.id = "loaderStyling";
    link.rel = "stylesheet";
    link.href = "../../src/Components/PopupWindows/Loader/loaderStyling.css";

    document.head.appendChild(link);
  }

  const div = document.createElement("div");
  div.className = "loaderMain";
  div.innerHTML = `
  <h1> Loading user data.. </h1>
     <div class="loader">
      <div class="loaderAfter"> </div>
      </div>
    `;

  return div;
};
