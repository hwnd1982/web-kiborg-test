// @ts-ignore
import * as webp from "gulp-webp";

import { app } from "../app";

/**
 * Создание изображений.
 * Выполняются следующие задачи:
 * - Копирование изображений из исходной директории в результирующую директорию.
 * - В режиме продакшн, создание для всех растровых изображений, оптимизированной копии изображения в формате webp.
 */
export const img = () => {
  return (
    app.gulp
      .src(app.path.src.img)
      .pipe(
        app.plugins.plumber(
          app.plugins.plumberNotifyHandler("Ошибка в картинках")
        )
      )
      .pipe(app.plugins.newer(app.path.build.img))

      // Выполняется в режиме продакшн.
      // .pipe(app.plugins.if( // Выполняется только в продакшн режиме.
      //     app.isProd,
      //     webp(), // Создание WEBP изображений.
      // ))

      // Выполняется в любом режиме.
      .pipe(webp()) // Создание WEBP изображений.
      .pipe(app.gulp.dest(app.path.build.img)) // Сохранение WEBP изображений.
      .pipe(app.gulp.src(app.path.src.img)) // Повторный выбор исходных изображений.

      .pipe(
        app.plugins.if(
          // Выполняется только в продакшн режиме.
          app.isProd,
          app.gulp.dest(app.path.build.img)
        )
      )
      .pipe(
        app.plugins.if(
          // Выполняется только в продакшн режиме.
          app.isProd,
          app.gulp.src(app.path.src.img) // Получаем доступ к изображениям (снова).
        )
      )
      .pipe(
        app.plugins.if(
          // Выполняется только в продакшн режиме.
          app.isProd,
          app.plugins.newer(app.path.build.img)
        )
      )

      .pipe(app.gulp.dest(app.path.build.img))
      .pipe(app.gulp.src(app.path.src.svg)) // Получаем доступ к svg изображениям.
      .pipe(app.gulp.dest(app.path.build.img)) // Копируем svg в директорию сборки.
      .pipe(app.plugins.browsersync.stream())
  );
};
