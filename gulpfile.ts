import { Gulp, TaskFunction } from "./node_modules/@types/gulp";
import * as colors from "colors";
import type { TaskCallback } from "undertaker";
import { dist, path } from "./gulp"; // Конфиги и плагины.
import { existsSync, mkdirSync } from 'fs';

import {
  cleaner,
  otfToTtf,
  ttfToWoff,
  ttfToWoff2,
  fontToCss,
  img,
  html,
  scss,
  typescript,
  js,
  server,
  assets,
  spriteSvg,
  zip,
} from "./gulp";

/**
 * Задача конвертации шрифтов и создания CSS с подключением шрифтов.
 */

const gulp: Gulp = require("gulp");
const fonts = gulp.series(otfToTtf, ttfToWoff, ttfToWoff2, fontToCss);

/**
 * Основные задачи.
 */

const mainTask: TaskFunction = gulp.series(
  fonts,
  gulp.parallel(
    assets,
    img,
    html,
    scss,
    gulp.series(typescript, js),
    spriteSvg,
  ),
);

/**
 * Задачи наблюдателя за изменением файлов.
 */
const watcher: TaskFunction = (): void => {
  gulp.watch(path.watch.assets, assets);
  gulp.watch(path.watch.img, img);
  gulp.watch(path.watch.html, gulp.series(scss, html));
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.ts, gulp.series(typescript, js));
  gulp.watch(path.watch.svgIcon, spriteSvg);
};

/**
 * Задачи режима разработки.
 */
const development: TaskFunction = gulp.series(
  async (cb: TaskCallback): Promise<void> => {
    console.log(
      colors.green("*** Запущена задача сборки в режиме разработки."),
    );

    cb();
  },
  cleaner,
  mainTask,
  gulp.parallel(watcher, server),
);

/**
 * Задачи сборки в режиме "продакшн".
 */
export const production: TaskFunction = gulp.series(
  (cb: TaskCallback): void => {
    console.log(
      colors.green('*** Запущена задача сборки в режиме "продакшн".'),
    );
    cb();
  },
  cleaner,
  mainTask,
);

/**
 * Задачи сборки дистрибутива в отдельную директорию, в режиме продакшн.
 */
const distributive: TaskFunction = gulp.series(cleaner, production, dist);

/**
 * Задача конвертации шрифтов и формирования файла fonts.scss.
 */
gulp.task("fonts", fonts);

/**
 * Задача создания спрайта SVG из SVG картинок.
 */
gulp.task("sprite", gulp.series(cleaner, spriteSvg));

/**
 * Архивация результатов сборки в zip архив.
 */
gulp.task("zip", gulp.series(cleaner, production, zip));

/**
 * Задача сборки дистрибутива в отдельную директорию, в режиме продакшн.
 */
gulp.task("dist", distributive);

/**
 * Задача по умолчанию.
 */
gulp.task("default", development);
gulp.task("js", gulp.series(typescript, js));
