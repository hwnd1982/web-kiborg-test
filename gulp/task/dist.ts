import { app } from "../app";
import * as path from "path";

/**
 * Создание директории, готовой для публикации проекта, либо внедрению файлов проекта в серверное back-end приложение.
 * Используется отдельная директория, так как разработка back-end и front-end может вестись параллельно и
 * back-end-у может требоваться стабильная версия front-end файлов.
 */
export const dist = () => {
  return app.gulp
    .src(path.resolve(app.path.dirBuild, "**", "*"))
    .pipe(app.gulp.dest(app.path.dirDist));
};
