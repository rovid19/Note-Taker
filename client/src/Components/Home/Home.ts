import { defaultUser } from "../../Stores/UserStore";

export const generateHome = (): HTMLElement => {
  if (!document.querySelector("homeStyling")) {
    const link = document.createElement("link");
    link.id = "homeStyling";
    link.rel = "stylesheet";
    link.href = "../../src/Components/Home/homeStyling.css";

    document.head.appendChild(link);
  }

  const home = document.createElement("div");
  home.className = "homeMainDiv";
  home.innerHTML = `
   <div class="homeDiv1"><h1>Welcome back, ${defaultUser.username}</h1> </div>
   <div class="homeDiv2">
   <button class="newProjectBtn"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="30">
   <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
 </svg>
  Start new project </button>
  
   
   </div>
   <div class="homeDiv3"> </div>
    `;

  return home;
};

export const generateHomeLoggedOut = (): HTMLElement => {
  if (!document.querySelector("homeStyling")) {
    const link = document.createElement("link");
    link.id = "homeStyling";
    link.rel = "stylesheet";
    link.href = "../../src/Components/Home/homeStyling.css";

    document.head.appendChild(link);
  }

  const home = document.createElement("div");
  home.className = "homeMainDiv";
  home.innerHTML = `
   <div class="homeDiv1"><h1>You're currently not logged in</h1> </div>
   <div class="homeDiv2">
   <button class="newProjectBtn"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" width="50">
   <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
 </svg>
 
  Log in </button>
  
   
   </div>
   <div class="homeDiv3"> </div>
    `;

  return home;
};
