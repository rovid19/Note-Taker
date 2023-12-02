import globalStore from "../../Stores/GlobalStore";
import {
  isComponentOpen,
  setComponentsToTrueOrFalseAccordingly,
} from "./RouterLogic";

class Router {
  routes: [];
  constructor(routes: []) {
    this.routes = routes;
  }

  getCurrentUrl() {
    console.log("1");
    const activeUrl = window.location.pathname;
    globalStore.set("url", activeUrl);
  }

  redirectToRoute() {
    console.log("2");
    const url = globalStore.get("url") as string;
    setComponentsToTrueOrFalseAccordingly(url);
  }

  navigateTo(pathname: string) {
    console.log("0", pathname);
    if (pathname === "/projects") {
      console.log("ok");
      const componentVisible = isComponentOpen();
      console.log(componentVisible);
      const url = window.location.pathname;
      console.log(url);
      if (componentVisible) {
        console.log(url);
        history.pushState(null, "", `/projects${url}`);
      } else {
        history.pushState(null, "", pathname);
      }
    } else {
      history.pushState(null, "", pathname);
    }

    this.getCurrentUrl();
  }
}

export const router = new Router([]);
