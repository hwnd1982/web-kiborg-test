import * as gulpZip from "gulp-zip";

import { app } from "../app";

/**
 * Создание ZIP архива с результатом сборки проекта.
 */
export const zip = () => {
  const archive: string = `build.zip`;

  return (
    app.gulp
      .src(`${app.path.dirBuild}/**/*`, {})
      .pipe(
        app.plugins.plumber(
          app.plugins.plumberNotifyHandler("Ошибка архивации ZIP")
        )
      )
      // @ts-ignore
      .pipe(gulpZip(archive))
      .pipe(app.gulp.dest(app.path.dirRoot))
  );
};
