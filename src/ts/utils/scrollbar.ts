import { store } from "./store";

export class Scrollbar {
  isHidden: boolean;
  scrollPosition: number;

  constructor() {
    this.isHidden = false;
    this.scrollPosition = 0;
  }

  hide() {
    if (!document.body.hasAttribute("data-body-scroll-fix")) {
      this.scrollPosition =
        window.scrollY || document.documentElement.scrollTop;

      const scrollPosition = window.scrollY;
      const scrollWidth = window.innerWidth - document.body.clientWidth;

      document.body.setAttribute(
        "data-body-scroll-fix",
        String(scrollPosition),
      );

      document
        .querySelectorAll<HTMLElement>("[data-fixed-block]")
        .forEach((block) => (block.style.paddingRight = `${scrollWidth}px`));

      document.body.style.paddingRight = `${scrollWidth}px`;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = "-" + scrollPosition + "px";
      document.body.style.left = "0";
      document.body.style.width = "100%";

      this.isHidden = true;

      return { scrollWidth };
    }
  }

  show() {
    if (document.body.hasAttribute("data-body-scroll-fix")) {
      document.body.removeAttribute("data-body-scroll-fix");

      document
        .querySelectorAll<HTMLElement>("[data-fixed-block]")
        .forEach((block) => (block.style.paddingRight = ``));

      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.width = "";

      window.scroll(0, +this.scrollPosition);

      this.isHidden = false;
    }
  }
}

export function initScrollbar() {
  store.scrollbar = new Scrollbar();
}
