export const generateHome = (): HTMLElement => {
  if (!document.querySelector("homeStyling")) {
    const link = document.createElement("link");
    link.id = "homeStyling";
    link.rel = "stylesheet";
    link.href = "./homeStyling.css";

    document.head.appendChild(link);
  }

  const home = document.createElement("div");
  home.className = "homeMainDiv";
  home.innerHTML = `
   
    `;

  return home;
};
