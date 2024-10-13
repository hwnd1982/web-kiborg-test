import { debounce } from "./debounce";

export function initVh() {
  setVh();
  window.addEventListener("resize", debounce(setVh, 300));

  function setVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
}
