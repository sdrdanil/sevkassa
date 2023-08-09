import * as nodePath from 'path';
import * as fs from 'fs';

const rootFolder = nodePath.basename(nodePath.resolve());
const buildFolder = process.argv.includes('--build') ? './dist' : './dev';
const srcFolder = './src';
const jsDir = `${srcFolder}/js/`;
const filenames = fs.readdirSync(jsDir);
const entryPoints = filenames.filter(name => name.slice(-3) == '.js').map(name => `${jsDir}${name}`);

export const path = {
  build: {
    js: `${buildFolder}/js/`,
    css: `${buildFolder}/css/`,
    images: `${buildFolder}/img/`,
    html: `${buildFolder}/`,
    fonts: `${buildFolder}/fonts/`,
    files: `${buildFolder}/files/`,
  },
  src: {
    js: entryPoints,
    scss: `${srcFolder}/scss/style.scss`,
    images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,ico}`,
    origimages: `${srcFolder}/origimages/**/*.{jpg,jpeg,png}`,
    svg: `${srcFolder}/img/**/*.svg`,
    html: `${srcFolder}/*.html`,
    svgicons: `${srcFolder}/svgicons/*.svg`,
    fonts: `${srcFolder}/fonts/*.*`,
    files: `${srcFolder}/files/**/*.*`,
  },
  watch: {
    js: `${srcFolder}/js/**/*.js`,
    scss: `${srcFolder}/scss/**/*.scss`,
    images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,svg,ico}`,
    html: `${srcFolder}/**/*.html`,
    files: `${srcFolder}/files/**/*.*`,
  },
  clean: buildFolder,
  buildFolder,
  srcFolder,
  rootFolder,
  ftp: 'public_html',
};
