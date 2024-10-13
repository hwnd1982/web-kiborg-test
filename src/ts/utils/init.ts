import PerfectScrollbar from "perfect-scrollbar";
import { initScrollbar, initVh, detectMob, initClickSmoothScroll } from "./";
import { initValidateForms } from "../modules";
import { initTextFields, initRadios } from "../ui";

export function initBase() {
  initScrollbar();
  initVh();
  initTextFields();
  initRadios();
  initValidateForms();
  initClickSmoothScroll();
  initCustomScrollbars();
  window.addEventListener("resize", initCustomScrollbars);
}

function initCustomScrollbars() {
  if (detectMob()) {
    window.store.customScrollbars.forEach((s) => s.destroy());
  } else {
    if (window.store.customScrollbars.length) {
      window.store.customScrollbars.forEach((s) => s.update());
    } else if (document.querySelector(`.custom-scroll`)) {
      document.querySelectorAll(`.custom-scroll`).forEach((s) => {
        window.store.customScrollbars.push(new PerfectScrollbar(s));
      });
    }
  }
}
