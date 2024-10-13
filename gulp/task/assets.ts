import * as gulp from "gulp";
import { app } from "../app";

/**
 * Копирование ресурсов как есть.
 */
export const assets: gulp.TaskFunction = () => {
  return app.gulp
    .src(app.path.src.assets)
    .pipe(app.gulp.dest(app.path.build.assets));
};
