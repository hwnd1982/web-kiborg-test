import { debounce } from "../../utils/debounce";
import type { TextFieldElement, TextFieldValidate } from "../../ui/text-field";
import type { RadioElement, RadioValidate } from "../../ui/radio";
import { states } from "../../utils";
import { initTextFieldsByFormId } from "../../ui/text-field";
import { initRadiosByFormId } from "../../ui/radio";

export type ValidateFormElement = HTMLFormElement & { validate?: ValidateForm };

export interface ValidateFormFields {
  inputs?: Array<TextFieldElement | RadioElement>;
  submit?: HTMLButtonElement;
}

export class ValidateForm {
  el: ValidateFormElement;
  fields: ValidateFormFields;
  isPending?: boolean;

  constructor(element: HTMLFormElement) {
    this.el = element;

    this.init();
  }

  private init = () => {
    this.initFields();

    this.initListeners();

    this.el.classList.add(states.init);
    this.el.validate = this;
  };

  public initFields = () => {
    this.fields = {};

    this.fields.submit =
      this.el.querySelector<HTMLButtonElement>(".js-form-submit");
    this.fields.inputs = [
      ...this.el.querySelectorAll<TextFieldElement>(".js-text-field"),
      ...this.el.querySelectorAll<RadioElement>(".js-radio"),
    ];
  };

  public initListeners = () => {
    this.el.addEventListener("focusin", this.handleFocusIn);
    this.el.addEventListener("submit", this.handleSubmitForm);
    this.el.addEventListener("focusout", this.handleFocusOut);
    this.el.addEventListener("input", debounce(this.handleInput, 150));
  };

  private handleSubmitForm = async (e: SubmitEvent) => {
    e.preventDefault();

    const id = this.el.getAttribute("data-form-id");

    document.dispatchEvent(
      new CustomEvent(id ? `form.submit.${id}` : "form.submit", {
        detail: {
          event: e,
          formInstance: this,
        },
      }),
    );

    console.log(`form.submit.${id}`);
    alert(`form.submit.${id}`)
  };

  private handleFocusIn = (e: Event) => {
    const target = e.target as HTMLInputElement;

    const field = target.closest(".js-text-field") as TextFieldElement;

    if (!field) return;

    field.classList.remove(states.error, states.warning);
  };

  private handleFocusOut = (e: Event) => {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      const field =
        target.closest<TextFieldElement>(".js-text-field") ||
        target.closest<RadioElement>(".js-radio");
  
      if (!field) return;
  
      this.checkValidByField(field);
    }
  };


  public handleInput = (e?: Event) => {
    const target = e.target;

    if (this.isPending) return;

    if (this.checkValidForm()) {
      this.removeSubmitDisabled();
    } else {
      this.setSubmitDisabled();
    }

    if (target instanceof HTMLInputElement) {
      const radio = target.closest<RadioElement>(".js-radio");

      if (radio) {
        this.checkValidByField(radio);
      }
    }
  };

  public setSubmitDisabled = () => {
    if (this.isPending) return;

    this.fields.submit?.setAttribute("disabled", "");
  };

  public removeSubmitDisabled = () => {
    if (this.isPending) return;

    this.fields.submit?.removeAttribute("disabled");
  };

  public checkValidByField = (field: TextFieldElement | RadioElement) => {
    let validate: {
      isValid: boolean;
      error: RadioValidate | TextFieldValidate | null;
    };

    if ("textField" in field) {
      validate = field.textField.checkValid();
    } else if ("radio" in field) {
      validate = field.radio.checkValid();
    }

    const { isValid, error } = validate;

    if (isValid) {
      field.classList.add(states.valid);
      field.classList.remove(states.error, "is-error-required");
    } else {
      field.classList.remove(states.error, "is-error-required");
      field.classList.remove(states.valid);
      field.classList.add(states.error);

      if (error === "required") {
        field.classList.add("is-error-required");
      }
    }
  };

  public checkValidForm = () => {
    let isValid = true;

    this.fields.inputs.forEach((input) => {
      if ("textField" in input) {
        if (!input.textField.checkValid().isValid) {
          isValid = false;
        }
      } else if ("radio" in input) {
        if (!input.radio.checkValid().isValid) {
          isValid = false;
        }
      }
    });

    return isValid;
  };
}

export function initValidateForms() {
  const forms = document.querySelectorAll<HTMLFormElement>(
    `.js-form:not(.${states.init})`,
  );

  forms.forEach((form) => {
    new ValidateForm(form);
  });
}

export function fullReInitFormById(id: string, hard: boolean = false) {
  initTextFieldsByFormId(id, hard);
  initRadiosByFormId(id, hard);
  initValidateFormById(id, hard);
}

export function initValidateFormById(id: string, hard: boolean = false) {
  if (!id) return;

  const forms = document.querySelectorAll<HTMLFormElement>(
    `#${id}.js-form${!hard ? `:not(.${states.init})` : ""}`,
  );

  forms.forEach((form) => {
    new ValidateForm(form);
  });
}

export function triggerValidateFormById(id: string) {
  if (!id) return;

  const forms = document.querySelectorAll<ValidateFormElement>(
    `#${id}.js-form.${states.init}`,
  );

  forms.forEach((form) => {
    form.validate.handleInput();
  });
}
