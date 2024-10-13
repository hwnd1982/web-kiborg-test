import { config } from "./utils/config";
import { initBase } from "./utils/init";
import {
  addPreloader,
  removePreloader,
  setPreloader,
  resetForm,
  resetFormById,
  store,
} from "./utils";
import {
  initValidateFormById,
  triggerValidateFormById,
  fullReInitFormById,
} from "./modules";

import { initTextFieldsByFormId, initRadiosByFormId } from "./ui";

if (!window.endpoints) {
  window.endpoints = {
    auth: config.BASE_API_URL + "/auth.json",
  };
}

document.addEventListener("DOMContentLoaded", initGlobal);

function initGlobal() {  
  window.store = store;
  window.initValidateFormById = initValidateFormById;
  window.triggerValidateFormById = triggerValidateFormById;
  window.initTextFieldsByFormId = initTextFieldsByFormId;
  window.initRadiosByFormId = initRadiosByFormId;
  window.fullReInitFormById = fullReInitFormById;
  window.setPreloader = setPreloader;
  window.addPreloader = addPreloader;
  window.removePreloader = removePreloader;
  window.resetForm = resetForm;
  window.resetFormById = resetFormById;

  initBase();
}
