import { Store } from "../utils";

export interface WindowEndpoints {
  auth: string;
}

declare global {
  interface Window {
    initValidateFormById?: (id: string, hard?: boolean) => void;
    triggerValidateFormById?: (id: string) => void;
    initTextFieldsByFormId?: (id: string, hard?: boolean) => void;
    initRadiosByFormId?: (id: string, hard?: boolean) => void;
    fullReInitFormById?: (id: string, hard?: boolean) => void;
    setFavoriteProducts?: () => void;
    getCitySelectValue?: () => string;
    setPreloader?: (value: boolean) => void;
    addPreloader?: () => void;
    removePreloader?: () => void;
    resetForm?: (form: HTMLFormElement) => void;
    resetFormById?: (id: string) => void;
    assetsUrl?: string;
    endpoints: WindowEndpoints;
    store: Store;
  }
}
