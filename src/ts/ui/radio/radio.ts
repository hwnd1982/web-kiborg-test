import type { ValidateFormElement } from "../../modules";
import { states } from "../../utils";

export type RadioElement = HTMLElement & { radio?: Radio };

export type RadioValidate = "required";

export interface RadioValidateResult {
  isValid: boolean;
  error: RadioValidate | null;
}

export class Radio {
  el: RadioElement;
  field: HTMLInputElement;
  validate: RadioValidate[];

  constructor(element: HTMLElement) {
    this.el = element;

    this.init();
  }

  private init = () => {
    this.field = this.el.querySelector<HTMLInputElement>(
      ".js-radio-field",
    ) as HTMLInputElement;

    this.defineValidate();
    this.initValidate();

    this.el.classList.add(states.init);
    this.el.radio = this;
  };

  public defineValidate = () => {
    const validateString = this.field.getAttribute("data-validate");

    if (!validateString) {
      this.validate = [];

      return;
    }

    const validateArray = validateString
      .replace(/\s/g, "")
      .split(",") as RadioValidate[];

    this.validate = validateArray;
  };

  public initValidate = () => {
    this.validate.forEach((setting) => {
      switch (setting) {
      }
    });
  };

  public checkValid = (): RadioValidateResult => {
    const validation: RadioValidateResult = {
      isValid: true,
      error: null,
    };

    if (this.validate.includes("required")) {
      const form = this.el.closest(".js-form") as ValidateFormElement;
      const radios = form.querySelectorAll<HTMLInputElement>(
        `[name="${this.field.name}"].js-radio-field`,
      );
      const isChecked = !!Array.from(radios).find((radio) => radio.checked);

      if (!isChecked) {
        validation.isValid = false;
        validation.error = "required";
      }
    }

    return validation;
  };
}

export function initRadios() {
  const radios = document.querySelectorAll<HTMLElement>(
    `.js-radio:not(.${states.init})`,
  );

  radios.forEach((radio) => {
    new Radio(radio);
  });
}

export function initRadiosByFormId(id: string, hard: boolean = false) {
  const radios = document.querySelectorAll<HTMLElement>(
    `#${id}.js-form .js-radio${!hard ? `:not(.${states.init})` : ''}`,
  );

  radios.forEach((radio) => {
    new Radio(radio);
  });
}
