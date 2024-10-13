import { Options } from "browser-sync";
import { TransformCallback } from "through2";

import { app } from "../app";

/**
 * Номер порта на котором запускается локальный веб сервер.
 */
const defaultPort: number = 8080;
/**
 * Хост, доменное имя или IP адрес, на котором запускается локальный веб сервер.
 */
const defaultHost: string = "localhost";

/**
 * Настройки запуска локального web сервера для режима разработки.
 */
const serverOpt: Options = {
  server: {
    baseDir: `${app.path.build.html}`,
  },
  notify: false,
  host: defaultHost,
  listen: defaultHost,
  port: defaultPort,
  open: false,
  reloadOnRestart: true,
};

/**
 * Задача gulp запуска локального web сервера.
 * @param done - Функция обратного вызова, должна вызываться при завершении задачи,
 * при использовании не потоковых задач.
 */
export const server = (done: TransformCallback): void => {
  app.plugins.browsersync.init(serverOpt);
  done();
};
