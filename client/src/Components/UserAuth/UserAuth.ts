import globalStore from "../../Stores/GlobalStore";

export const generateLogin = (): HTMLElement => {
  const div = document.createElement("div");
  div.className = "userAuthMainDiv";
  div.innerHTML = `
    <form class="userAuthForm">
    <svg class="userAuthSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="25">
  <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clip-rule="evenodd" />
</svg>

    <div class="userAuthDiv1">
        <legend class="userAuthLegend"> Login </legend>
        <h5 class="userAuthH4"> Don't have an account yet? <span class="span">click here!</span> </h5>
        </div>
        <fieldset class="userAuthFieldset">
            <input class="userAuthInput" id="email" placeholder="Email"/>
            <input type="password" class= "userAuthInput" id="password" placeholder="Password"/>
        </fieldset>
        <div class="userAuthDiv2">
            <button class="userAuthButton"> Login </button>
        </div>

    </form>
    `;

  globalStore.set("loginOrRegister", "login");

  return div;
};

export const generateRegister = (): HTMLElement => {
  const div = document.createElement("div");
  div.className = "userAuthMainDiv";
  div.innerHTML = `
      <form class="userAuthForm">
      <svg class="userAuthSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="25">
    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clip-rule="evenodd" />
  </svg>
  
      <div class="userAuthDiv1">
          <legend class="userAuthLegend"> Register </legend>
          <h5 class="userAuthH4"> Already a user? <span class="span">click here!</span> </h5>
          </div>
          <fieldset class="userAuthFieldset">
              <input class="userAuthInput" type="email" id="email" placeholder="Email"/>
              <input class="userAuthInput" id="username" placeholder="Username"/>
              <input type="password" class="userAuthInput" id="password"  placeholder="Password"/>
              <input type="password" class="userAuthInput" id="password2"  placeholder="Confirm password"/>
          </fieldset>
          <div class="userAuthDiv2">
              <button class="userAuthButton"> Register </button>
          </div>
  
      </form>
      `;

  globalStore.set("loginOrRegister", "register");

  return div;
};
