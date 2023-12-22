import globalStore from "../../../Stores/GlobalStore";
import { generateLoader } from "./Loader";

export const isLoaderVisible = () => {
  const loader = globalStore.get("loaderVisible") as boolean;
  if (loader) {
    createLoader();
  } else {
    document.querySelector(".loader-container")?.remove();
  }
};

const createLoader = () => {
  const div = document.createElement("div");
  div.className = "loader-container";
  document.body.appendChild(div).appendChild(generateLoader());
};
