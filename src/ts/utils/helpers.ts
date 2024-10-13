export function setPreloader(
  value: boolean,
) {
  if (value) addPreloader();
  else removePreloader();
}

export function addPreloader(
  container: HTMLElement = document.body,
  className: string = "loader-opacity-fixed",
) {
  container.insertAdjacentHTML(
    "beforeend",
    `<div class="js-preloader ${className}"></div>`,
  );
}

export function removePreloader(container: HTMLElement = document.body) {
  const preloader = container.querySelector<HTMLElement>("& > .js-preloader");

  preloader?.remove();
}

export function resetForm(form: HTMLFormElement) {
  if (!form) return;

  const submitBtn = form.querySelector(".js-form-submit");

  submitBtn && (submitBtn.setAttribute("disabled", ''));
  form.reset();
}

export function resetFormById(id: string) {
  resetForm(document.getElementById(id) as HTMLFormElement);
}

export function initClickSmoothScroll() {
  document.addEventListener('click', async (e) => {
    const link = (e.target as HTMLElement).closest('.js-smooth-scroll');

    if (!link) return;

    e.preventDefault();

    const el = document.querySelector<HTMLElement>(link.getAttribute('href'));

    if (el) {
      smoothScrollToElement(el, true);
    }
  });
}

function smoothScrollToElement(element: HTMLElement, repeat: boolean) {
  let offset = 0;

  const header = document.querySelector<HTMLElement>('.js-header');

  if (header) {
    offset = header.offsetHeight;
  }

  window.scrollBy({
    top: element.getBoundingClientRect().top - 25 - offset,
    behavior: 'smooth',
  });

  //костыли из-за lazy картинок на случай, если не загрузились сразу
  if (repeat) {
    if ("onscrollend" in window) {
      document.addEventListener("scrollend", (e) => {
        smoothScrollToElement(element, false);
      }, {once: true});
    }
  }
}
