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
    const activeUrl = window.location.pathname;
    globalStore.set("url", activeUrl);
  }

  redirectToRoute() {
    const url = globalStore.get("url") as string;
    setComponentsToTrueOrFalseAccordingly(url);
  }

  navigateTo(pathname: string) {
    if (pathname === "/projects") {
      const componentVisible = isComponentOpen();
      const url = window.location.pathname;
      if (componentVisible) {
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
