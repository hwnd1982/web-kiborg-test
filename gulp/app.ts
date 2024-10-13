import * as gulp from "gulp";
import { path, plugins } from "./config";

/**
 * Переменная с настройками сборки проекта.
 */
export const app = {
  isProd: process["argv"].includes("--prod"),
  isProdDev: process["argv"].includes("--dev"),
  isDev: !process["argv"].includes("--prod"),
  path: path,
  gulp: gulp,
  plugins: plugins,
};
