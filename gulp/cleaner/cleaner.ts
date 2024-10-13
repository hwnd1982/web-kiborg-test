import * as path from "path";
// @ts-ignore
import * as vinyl from "vinyl";
// @ts-ignore
import { TransformCallback, obj as through2Obj } from "through2";
import { rmSync, rmdirSync, Stats, statSync, readdirSync } from "fs";

/**
 * Функция управляемого логирования.
 * @param options - Объект настроек.
 * @param data    - Логируемые данные.
 */
const log = (options: CleanOption, ...data: any[]): void => {
  if (options.verbose) {
    console.log(...data);
  }
};

/**
 * Интерфейс настроек.
 */
export interface CleanOption {
  verbose: boolean;
}

/**
 * Функция очистки директории, gulp плагин.
 * @param options - Настройки очистки.
 */
export const clean = (options?: CleanOption): NodeJS.ReadWriteStream => {
  let rmEmptyDir: (dirName: string) => void; // Функция удаления пустой директории.
  let parentDir: string = ""; // Путь к вышестоящей директории.
  let ret: vinyl.StreamFile[] = []; // Объект файла.

  // Если настройки не переданы, создаётся объект пустых настроек.
  !options ? (options = { verbose: false }) : options;
  // Удаление пустой директории.
  // Если удаление пустой директории создало пустую директорию, она так же удаляется и далее рекурсивно.

  rmEmptyDir = (dirName: string): void => {
    const list: string[] = readdirSync(dirName);
    
    if (dirName !== "" && dirName !== "." && list.length == 0) {
      try {
        rmdirSync(dirName);
        log(options!, `удаление пустой директории '${dirName}'`);
      } catch (e: unknown) {
        log(
          options!,
          `удаление пустой директории ${dirName} прервано ошибкой: ${e}`,
        );
      }
      parentDir = path.dirname(dirName);
      if (parentDir !== "" && parentDir !== ".") rmEmptyDir(parentDir); // Рекурсия.
    }
  };

  // Возврат функции очистки в обёртке для использования в gulp.
  return through2Obj(
    (
      file: vinyl.StreamFile,
      _enc: BufferEncoding,
      cb: TransformCallback,
    ): vinyl.StreamFile[] => {
      let filepath: string = file.path; // Путь к файлу или директории.
      let cwd: string = file.cwd; // Текущая рабочая директория.
      let relative: string = path.relative(cwd, filepath); // Относительный путь к директории или файлу.
      let stat: Stats = statSync(relative); // Запрос информации о файле или директории из файловой системы.

      // Получена директория.
      if (stat.isDirectory()) {
        // Директория удаляется только если она пустая.
        rmEmptyDir(relative);
        // Завершение.
        ret.push(file);
        cb();
        return ret;
      }
      try {
        // Удаление файла с защитой от исключения.
        rmSync(filepath);
        // Завершение.
        ret.push(file);
        log(options!, `${relative} - файл, удалён.`);
      } catch (e: unknown) {
        log(options!, `удаление файла ${filepath} прервано ошибкой: ${e}`);
      }
      // Директория удаляется только если она пустая.
      rmEmptyDir(path.dirname(relative));
      // Завершение.
      cb();

      return ret;
    },
  );
};
