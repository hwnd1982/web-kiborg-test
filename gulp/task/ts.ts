import * as ts from "gulp-typescript";
import { Project } from "gulp-typescript";
import * as sourcemaps from "gulp-sourcemaps";
import { TransformCallback } from "through2";

import { app } from "../app";
import { clean } from "../cleaner";
import { existsSync, mkdirSync } from "fs";

/**
 * Настройки tsconfig.json для формирования из typescript кода javascript код требуемой версии.
 */
const tsProject: Project = ts.createProject("tsconfig.json", {});

/**
 * Создание из typescript кода javascript код.
 */
export const typescript = (_done: TransformCallback) => {
  const dir = `${app.path.tmp.js}/**/*`;

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  return app.gulp
    .src(dir, { allowEmpty: true }) // Выбор временной папки сборки.
    .pipe(clean()) // Очистка временной папки сборки js.
    .pipe(app.gulp.src(app.path.src.ts, {})) // Выбор папки с исходными скриптами на typescript.
    .pipe(
      app.plugins.plumber(
        app.plugins.plumberNotifyHandler("Ошибка в Typescript")
      )
    )
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write(".", { includeContent: true }))
    .pipe(app.gulp.dest(app.path.tmp.js));
};
