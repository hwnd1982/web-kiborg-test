import * as svgSprite from "gulp-svg-sprite";

import { app } from "../app";

/**
 * Настройки создания спрайта из набора SVG картинок или иконок.
 */
const svgSpriteOpt: any = {
  shape: {
    transform: [
      {
        svgo: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  inlineStyles: {
                    onlyMatchedOnce: false,
                  },
                  removeViewBox: false,
                },
              },
            },
            {
              name: "convertStyleToAttrs",
            },
            {
              name: "removeAttrs",
              params: {
                attrs: ["fill"],
              },
            },
          ],
        },
      },
    ],
  },
  mode: {
    stack: {
      sprite: `../sprite/sprite.svg`,
      example: app.isDev,
    },
  },
};

/**
 * Создание SVG спрайта из группы SVG изображений.
 */
export const spriteSvg = () => {
  return (
    app.gulp
      .src(app.path.src.svgIcon)
      .pipe(
        app.plugins.plumber(
          app.plugins.plumberNotifyHandler("Ошибка SVG спрайта")
        )
      )
      // @ts-ignore
      .pipe(svgSprite(svgSpriteOpt))
      .pipe(app.gulp.dest(app.path.build.img))
      .pipe(app.plugins.browsersync.stream())
  );
};
