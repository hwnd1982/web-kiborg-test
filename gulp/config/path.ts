// @ts-ignore
import * as nodePath from "path";

// @ts-ignore
const dirRoot: string = nodePath.resolve(process.cwd());
const dirBuild: string = nodePath.resolve(dirRoot, "build");
const dirSource: string = nodePath.resolve(dirRoot, "src");
const dirDist: string = nodePath.resolve(dirRoot, "dist");

export const path = {
  build: {
    assets: nodePath.resolve(dirBuild, "assets"),
    fonts: nodePath.resolve(dirBuild, "fonts"),
    img: nodePath.resolve(dirBuild, "img"),
    html: nodePath.resolve(dirBuild),
    css: nodePath.resolve(dirBuild, "css"),
    js: nodePath.resolve(dirBuild, "js"),
  },
  src: {
    assets: nodePath.resolve(dirSource, "assets", "**", "*"),
    fonts: nodePath.resolve(dirSource, "fonts"),
    fontsOtf: nodePath.resolve(dirSource, "fonts", "**", "*.otf"),
    fontsTtf: [
      nodePath.resolve(dirRoot, ".tmp", "**", "*.ttf"),
      nodePath.resolve(dirSource, "fonts", "**", "*.ttf"),
    ],
    img: nodePath.resolve(dirSource, "img", "**", "*.{webp,png,jpg,jpeg,gif}"),
    svg: nodePath.resolve(dirSource, "img", "**", "*.svg"),
    html: nodePath.resolve(dirSource, "html", "*.twig"),
    scss: nodePath.resolve(dirSource, "scss", "**", "main.scss"),
    ts: nodePath.resolve(dirSource, "ts", "**", "*.ts"),
    svgIcon: nodePath.resolve(dirSource, "svg-icon", "**", "*.svg"),
  },
  watch: {
    assets: "./src/assets/**/*.{webp,svg,png,jpg,jpeg,gif}",
    img: "./src/img/**/*",
    html: "./src/html/**/*.twig",
    scss: "./src/scss/**/*.scss",
    ts: "./src/ts/**/*.ts",
    js: nodePath.resolve(".", ".tmp", "**", "*.js"),
    svgIcon: "./src/svg-icon/**/*.svg",
  },
  clean: [
    nodePath.resolve(dirBuild, "assets", "**", "*"),
    nodePath.resolve(dirBuild, "img", "**", "*"),
    nodePath.resolve(dirBuild, "css", "**", "*"),
    nodePath.resolve(dirBuild, "js", "**", "*"),
    nodePath.resolve(dirBuild, "**", "*.twig"),
  ],
  tmp: {
    fonts: nodePath.resolve(dirRoot, ".tmp", "fonts"),
    js: nodePath.resolve(dirRoot, ".tmp", "js"),
  },
  dirRoot: dirRoot,
  dirBuild: dirBuild,
  dirSource: dirSource,
  dirDist: dirDist,
};
