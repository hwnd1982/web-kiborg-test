import * as plumber from "gulp-plumber"; // Обработка ошибок.
import * as newer from "gulp-newer"; // Проверка обновления изображений.
import * as browsersync from "browser-sync"; // Локальный web сервер.
import { TransformCallback } from "through2"; // Функции stream transform для gulp.
// @ts-ignore
import * as replace from "gulp-replace"; // Поиск и замена.
// @ts-ignore
import * as notify from "gulp-notify"; // Сообщения и подсказки в ОС.
// @ts-ignore
import * as gulpIf from "gulp-if"; // Плагин обработки условий.

/**
 * Функция возвращает конфигурацию с разным заголовком.
 * @param title - Заголовок конфигурации.
 */
const plumberNotifyHandler = (title: string): { errorHandler: any } => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: "Ошибка: <%= error.message %>",
      sound: false,
    }),
  };
};

/**
 * Пустая функция обратного вызова.
 * @param _err  - Объект ошибки.
 * @param _data - Объект данных.
 */
const cb: TransformCallback = (_err?: any, _data?: any): void => {};

/**
 * Олагины используемые в задачах gulp данной сторки.
 */
export const plugins: any = {
  replace: replace,
  plumber: plumber,
  plumberNotifyHandler: plumberNotifyHandler,
  notify: notify,
  browsersync: browsersync,
  newer: newer,
  cb: cb,
  if: gulpIf,
};
