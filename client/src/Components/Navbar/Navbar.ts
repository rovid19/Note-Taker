export const generateNavbar = (): HTMLElement => {
  // If current HTML file doesn't have any elemnt with ID of navbarStyles
  if (!document.querySelector("#navbarStylesLink")) {
    const styleLink = document.createElement("link");
    styleLink.id = "navbarStylesLink";
    styleLink.rel = "stylesheet";
    styleLink.href = "../../src/Components/Navbar/navbarStyles.css";

    document.head.appendChild(styleLink);
  }

  const navbar = document.createElement("header");

  navbar.className = "navbarStyles";
  navbar.innerHTML = `
  <div class="navbarTopContainer"> 
    <div class="navbarTopContainerInnerDiv1">
        <div class="ntcInnerDivUsernameDiv">
            <div class="userDiv1">
            <div class="pictureDiv"> G</div>
            </div>
            <div class="userDiv2">
            <h1 class="username">Guest</h1> </div>
        </div>
    </div> 
    <div class="navbarTopContainerInnerDiv2"> 
    <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="30">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        </div>
      <input class="search" placeholder="Search"/>
       
    </div>
    <div class="navbarBottomContainerInnerDiv1">
    <div class="nbcInnerDiv1Con1"> 
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="30">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    </div>
    <div class="nbcInnerDiv1Con2"> 
        <h1>New Note</h1>
    </div>
</div> 
  </div>
  <div class="navbarBottomContainer">

    <div class="navbarBottomContainerInnerDiv2">
        <nav>
            <ul> <li class="homeLi"> <div class="mainLiDiv"><div class="liDiv1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          </div>
          <div class="liDiv2">Home</div></li>
            
                <li class="allNotesLi"> <div class="mainLiDiv"><div class="liDiv1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg></div>
              <div class="liDiv2">My projects</div></li>
               
              <li class="todoListLi"><div class="mainLiDiv"><div class="liDiv1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
               </div><div class="liDiv2">Daily todo</div></div></li>
               
               <li class="loginLi"><div class="mainLiDiv"><div class="liDiv1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
               <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
             </svg>
             
              </svg>
               </div><div class="liDiv2">Login</div></div></li>
            </ul>

        </nav>
    </div>
  </div>`;

  return navbar;
};
