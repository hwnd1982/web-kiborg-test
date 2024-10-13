import * as htmlmin from "gulp-htmlmin";
import * as HTMLMinifier from "html-minifier";
import * as fileinclude from "gulp-file-include";
// @ts-ignore
import * as webpHtmlNosvg from "gulp-webp-html-nosvg";
// @ts-ignore
import * as versionNumber from "gulp-version-number";
// @ts-ignore
import * as prettyHtml from "gulp-pretty-html";
// @ts-ignore
import * as twig from "gulp-twig";

import { app } from "../app";

/**
 * Настройки очистки HTML.
 */
const htmlminOpt: HTMLMinifier.Options = {
  caseSensitive: true, // Обработка атрибутов HTML с учётом регистра.
  collapseWhitespace: true, // Удаление переносов.
  conservativeCollapse: true, // Сворачивание множество пробелов до одного.
  removeComments: true, // Удаление комментариев.
};

/**
 * Настройки форматирования HTML используемого в режиме разработки, так как красивый HTML удобно и приятно читать.
 */
const prettyHtmlOpt: any = {
  indent_size: 2, // Размер отступа. (По умолчанию: 4).
  indent_char: " ", // Символ отступа. (По умолчанию пробел).
  indent_with_tabs: false, // Отступ с использованием табуляции, переопределяет indent_size и indent_char.
  eol: "\\n", // Символ или символы переноса строки.
  end_with_newline: true, // Заканчивать вывод новой строкой.
  preserve_newlines: true, // Сохранить существующий разрыв строк.
  max_preserve_newlines: 2, // Максимальное количество сохраняемых переносов строк. (По умолчанию: 10).
  indent_inner_html: false, // Отступы в разделах <head> и <body>. (По умолчанию: ложь.)
  brace_style: "collapse", // [collapse-preserve-inline|collapse|expand|end-expand|none]. (По умолчанию: "collapse").
  indent_scripts: "normal", // [keep|separate|normal] (По умолчанию: "normal").
  wrap_line_length: 250, // Максимальное количество символов в строке. 0-отключено. (По умолчанию: 250).
  wrap_attributes: "auto", // Перенос атрибутов на новые строки. [auto|force|force-aligned|force-expand-multiline] (По умолчанию: "auto").
  wrap_attributes_indent_size: "", // Indent wrapped attributes to after N characters [indent-size] (ignored if wrap-attributes is "force-aligned")
  unformatted: ["inline"], // Список тегов не подвергающихся переформатированию. (По умолчанию: ["inline"]).
  content_unformatted: ["pre"], // Список тегов контент которые не переформатируется. (По умолчанию: ["pre"]).
  extra_liners: ["body"], // Список тегов, перед которыми должна быть пустая строка. (По умолчанию: ["head", "body", "/html"].
};

/**
 * Настройки автоматического создания файла версии html.
 */
const versionNumberSettings: any = {
  value: "%DT%",
  append: {
    key: "_v",
    cover: 0,
    to: ["css", "js"],
  },
  output: {
    file: "gulp/version.json",
  },
};

/**
 * Создание HTML файлов.
 * При создании HTML файлов выполняются следующие задачи:
 * - Формируется столько HTML файлов сколько создано в корне папки, обычно по одному на раздел.
 * - Формирование HTML файлов выполняется с возможностью вставки кусков HTML из библиотеки компонентов.
 * - В режиме разработки, результирующий HTML форматируется для удобства чтения.
 * - В продакшн режиме, результирующий HTML очищается и сжимается в одну строку.
 */
export const html = () => {
  return (
    app.gulp
      .src(app.path.src.html)
      .pipe(
        app.plugins.plumber(app.plugins.plumberNotifyHandler("Ошибка в HTML"))
      )
      // @ts-ignore
      .pipe(twig())
      .pipe(app.plugins.replace(/@img\//g, "/img/"))
      .pipe(app.plugins.replace(/@sprite/g, "/img/sprite/sprite.svg"))

      // Выполняется в режиме продакшн.
      // .pipe(app.plugins.if( // Выполняется только в продакшн режиме.
      //     app.isProd,
      //     webpHtmlNosvg(), // Вставляет в HTML для всех изображений загрузку webp версий.
      // ))

      // Выполняется в любом режиме.
      .pipe(webpHtmlNosvg()) // Вставляет в HTML для всех изображений загрузку webp версий.

      // .pipe(
      //   app.plugins.if(
      //     // Выполняется только в продакшн режиме.
      //     app.isProd,
      //     versionNumber(versionNumberSettings)
      //   )
      // )
      // .pipe(
      //   app.plugins.if(
      //     // Выполняется только в продакшн режиме.
      //     app.isProd,

      //     // @ts-ignore
      //     htmlmin(htmlminOpt) // Минификация HTML.
      //   )
      // )

      // Выполняется в режиме разработчика.
      .pipe(
        prettyHtml(prettyHtmlOpt) // Красивый читабельный HTML.
      )

      .pipe(app.gulp.dest(app.path.build.html))
      .pipe(app.plugins.browsersync.stream())
  );
};
