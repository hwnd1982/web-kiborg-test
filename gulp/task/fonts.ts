import * as fs from "fs";
import * as path from "path";
import * as vinyl from "vinyl";
import * as through2 from "through2";
// @ts-ignore
import * as fonter from "gulp-fonter";
import * as colors from "colors";
import * as rename from "gulp-rename";
import * as ttf2woff2 from "gulp-ttf2woff2";
import { TransformCallback } from "through2";

import { app } from "../app";

const fontsScssPath: string = `${app.path.dirSource}/scss/fonts.scss`; // Имя файла SCSS.

/**
 * Расширения имён файлов поддерживаемых WEB шрифтов.
 */
const fontTypesExt: string[] = ["woff2", "woff"];

/**
 * Функция проверяет путь и если результирующий файл уже есть, возвращает "ложь".
 * @param file - путь и имя файла.
 */
const ifFn = (file: any) => {
  const lPath = file.path.replace(app.path.dirSource, "").replace(/^\//, "");
  let ret: boolean = false;
  let dFile: string = path.join(app.path.dirBuild, lPath).split(".")[0];
  fontTypesExt.forEach((t) => {
    if (!fs.existsSync(`${dFile}.${t}`)) ret = true;
  });
  return ret;
};

/**
 * Функция рекурсивного чтения директории и всх вложенных директорий.
 * @param fFn - Функция обработки считанных файлов.
 * @param dir - Начальная директория.
 */
const readDirFn = (fFn: (file: any) => boolean, dir: string) => {
  let ret: any[] = [];
  fs.readdirSync(dir).forEach((fileName: string): void => {
    const file: string = path.join(dir, fileName);
    const fsFile: fs.Stats = fs.lstatSync(file);
    if (fsFile.isDirectory()) {
      readDirFn(fFn, file).forEach((value) => {
        ret.push(value);
      });
      return;
    }
    ret.push(fFn(file));
  });
  return ret;
};

/**
 * Попытка получения атрибутов шрифта из имени файла шрифта.
 * @param fontPath - Путь к файлу шрифта.
 * @param name     - Название файла шрифта.
 */
const fontAttributesByFilename = (fontPath: string, name: string): any => {
  const fontFileName: string = name.split(".")[0];
  const fontPathFileName: string = fontPath.split(".")[0];
  const fontName: string = fontFileName.split("-")[0]
    ? fontFileName.split("-")[0]
    : fontFileName[0];
  let fontWeight: string = fontFileName.split("-")[1]
    ? fontFileName.split("-")[1]
    : fontFileName[0];

  if (fontWeight.toLowerCase() === "thin") {
    fontWeight = "100";
  } else if (fontWeight.toLowerCase() === "extralight") {
    fontWeight = "200";
  } else if (fontWeight.toLowerCase() === "light") {
    fontWeight = "300";
  } else if (fontWeight.toLowerCase() === "medium") {
    fontWeight = "500";
  } else if (fontWeight.toLowerCase() === "semibold") {
    fontWeight = "600";
  } else if (fontWeight.toLowerCase() === "bold") {
    fontWeight = "700";
  } else if (
    fontWeight.toLowerCase() === "extrabold" ||
    fontWeight.toLowerCase() === "heavy"
  ) {
    fontWeight = "800";
  } else if (fontWeight.toLowerCase() === "black") {
    fontWeight = "900";
  } else {
    fontWeight = "normal";
  }
  return {
    file: "",
    baseName: "",
    baseFile: "",
    dirName: "",
    prefix: "",
    fontPath: fontPathFileName,
    fontFileName: fontFileName,
    fontFamily: fontName,
    fontWeight: fontWeight,
    types: [],
  };
};

/**
 * Вспомогательная функция потока gulp не делающая ничего.
 */
const nopFn = (): NodeJS.ReadWriteStream => {
  let ret: vinyl.StreamFile[] = [];
  return through2.obj(
    (
      file: vinyl.StreamFile,
      _enc: string,
      cb: TransformCallback,
    ): vinyl.StreamFile[] => {
      ret.push(file);
      cb();
      return ret;
    },
  );
};

/**
 * Конвертация шрифтов из формата OTF в формат TTF.
 */
export const otfToTtf = (done: TransformCallback) => {
  // Не создавать файл, если файл есть.
  if (fs.existsSync(fontsScssPath)) {
    console.log(
      colors.yellow(
        `** Шрифты уже конвертированы из формата OTF в формат TTF. Чтобы конвертировать их повторно удалите файл ${fontsScssPath}.`,
      ),
    );
    done();
    return;
  }

  return (
    app.gulp
      .src(app.path.src.fontsOtf, {})
      .pipe(
        app.plugins.plumber(
          app.plugins.plumberNotifyHandler("Ошибка в шрифтах OTF"),
        ),
      )
      // @ts-ignore
      .pipe(fonter({ formats: ["ttf"] })) // Конвертирование OTF в TTF.
      .pipe(
        // @ts-ignore
        rename((path): void => {
          // Какой-то ужасный баг с путями в fonter,
          // как исправить не понятно, поэтому вставляем костыль.
          path.basename = path.basename.replace("\\", "/");
        }),
      )
      .pipe(app.gulp.dest(app.path.tmp.fonts))
  ); // Выгрузка в директорию результата.
};

/**
 * Конвертация шрифтов из формата TTF в формат WOFF.
 */
export const ttfToWoff = (done: TransformCallback) => {
  // Не создавать файл, если файл есть.
  if (fs.existsSync(fontsScssPath)) {
    console.log(
      colors.yellow(
        `Шрифты уже конвертированы из формата TTF в формат WOFF. Чтобы конвертировать их повторно удалите файл ${fontsScssPath}.`,
      ),
    );
    done();
    return;
  }

  for (const path of app.path.src.fontsTtf) {
    const dir = path.replace(/^([^*]*)(.*)$/g, '$1')

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  return (
    app.gulp
      .src(app.path.src.fontsTtf, {})
      .pipe(
        app.plugins.plumber(
          app.plugins.plumberNotifyHandler("Ошибка в шрифтах TTF"),
        ),
      )
      // @ts-ignore
      .pipe(fonter({ formats: ["woff"] })) // Конвертирование TTF в WOFF.
      .pipe(
        // @ts-ignore
        rename((path: rename.ParsedPath): void => {
          // Какой-то ужасный баг с путями в fonter,
          // как исправить не понятно, поэтому вставляем костыль.
          path.basename = path.basename.replace("\\", "/");
        }),
      )
      .pipe(app.gulp.dest(app.path.build.fonts))
  ); // Выгрузка в директорию результата.
};

/**
 * Конвертация шрифтов из формата TTF в формат WOFF2.
 * @param _done - Функция обратного вызова, должна вызываться при завершении задачи,
 * при использовании не потоковых задач.
 */
export const ttfToWoff2 = (done: TransformCallback) => {
  if (fs.existsSync(fontsScssPath)) {
    console.log(
      colors.yellow(
        `Шрифты уже конвертированы из формата TTF в формат WOFF2. Чтобы конвертировать их повторно удалите файл ${fontsScssPath}.`,
      ),
    );
    done();
    return;
  }

  if (!fs.existsSync(app.path.build.fonts)) {
    fs.mkdirSync(app.path.build.fonts, { recursive: true });
  }

  return (
    app.gulp
      .src(app.path.src.fontsTtf, {})
      .pipe(
        app.plugins.plumber(
          app.plugins.plumberNotifyHandler("Ошибка в шрифтах TTF"),
        ),
      )
      // @ts-ignore
      .pipe(app.plugins.if(ifFn, ttf2woff2(), nopFn()))
      .pipe(app.gulp.dest(app.path.build.fonts))
  ); // Выгрузка в директорию результата.
};

/**
 * Создание файла fonts.scss, для подключения шрифтов в файлы стилей.
 * Файл fonts.scss создаётся один раз и больше не перезаписывается, сделано это для возможности ручного исправления
 * файла, так как автоматическое его создание может содержать ошибки.
 * @param done
 */
export const fontToCss = (done: TransformCallback): void => {
  const fonts: any[] = [];

  // Не создавать файл, если файл есть.
  if (fs.existsSync(fontsScssPath)) {
    console.log(
      `Файл ${fontsScssPath} существует. Чтобы создать новый, необходимо удалить файл.`,
    );
    done();
    return;
  }
  // Создание нового файла.
  // const fontsScss = fs.openSync(fontsScssPath, "w");
  const fontsAll: any[] = readDirFn(
    (file) => {
      const basename: string = path.basename(file);
      const dirname: string = path.dirname(file);
      const prefix: string = dirname
        .replace(app.path.build.fonts.replace(/\/+$/, ""), "")
        .replace(/^\/+/, "");
      const fontPath: string = path.join("fonts", prefix, basename);
      let info = fontAttributesByFilename(fontPath, basename);

      info.file = file;
      info.baseName = basename;
      info.dirName = dirname;
      info.prefix = prefix;
      info.baseFile = path.join(app.path.dirBuild, info.fontPath);
      if (info.prefix !== "") info.fontFamily = info.prefix;

      return info;
    },
    app.path.build.fonts.replace(/\/+$/, ""),
  );
  // Дедупликация файлов шрифтов, так как используются две версии woff и woff2.
  fontsAll.forEach((element): void => {
    let found: boolean = false;
    fonts.forEach((item): void => {
      if (item.baseFile === element.baseFile) found = true;
    });
    fontTypesExt.forEach((t: string): void => {
      if (fs.existsSync(`${element.baseFile}.${t}`)) {
        element.types.push(t);
      }
    });
    if (!found) fonts.push(element);
  });
  // Формирование CSS файла путём добавления.

  fonts.forEach((info): void => {
    let src: string = "";
    let srcFiles: any[] = [];

    info.types.forEach((t: string): void => {
      const uri: string = `@${info.fontPath}.${t}`;
      srcFiles.push(`url("${uri}") format("${t}")`);
    });
    if (srcFiles.length <= 0) return;
    src = srcFiles.join(", ");

    fs.appendFileSync(
      fontsScssPath,
      `@font-face {\n\tfont-family: '${info.fontFamily}';\n\tsrc: local("${info.fontFamily}"), ${src};\n\tfont-weight: ${info.fontWeight};\n\tfont-display: swap;\n\tfont-style: normal;\n}\n\n`,
    );
  });
  done();
};
