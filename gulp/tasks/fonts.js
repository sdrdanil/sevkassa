import fs from 'fs';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTtf = () => {
  return app.gulp
    .src(`${app.path.srcFolder}/fonts/*.otf`, {})
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'FONTS',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(
      fonter({
        formats: ['ttf'],
      })
    )
    .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`));
};

export const ttfToWoff = () => {
  return app.gulp
    .src(`${app.path.srcFolder}/fonts/*.ttf`, {})
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'FONTS',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(
      fonter({
        formats: ['woff'],
      })
    )
    .pipe(app.gulp.dest(app.path.build.fonts))
    .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
    .pipe(ttf2woff2())
    .pipe(app.gulp.dest(app.path.build.fonts));
};

const weights = {
  thin: 100,
  extralight: 200,
  light: 300,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  heavy: 800,
  black: 900,
};

export const fontsStyle = () => {
  let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
  fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
    if (fontsFiles) {
      if (!fs.existsSync(fontsFile)) {
        fs.writeFile(fontsFile, '', cb);
        let newFileOnly;
        for (var i = 0; i < fontsFiles.length; i++) {
          let fontFileName = fontsFiles[i].split('.')[0];
          if (newFileOnly !== fontFileName) {
            let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
            let fontWeight = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
            fontWeight = weights[fontWeight.toLocaleLowerCase()] ?? 400;
            fs.appendFile(
              fontsFile,
              `@font-face {
                font-family: ${fontName};
                font-display: swap;
                src: url("../fonts/#${fontFileName}.woff") format("woff"), url("../fonts/#${fontFileName}.woff2") format("woff2");
                font-weight: #{$weight};
                font-style: #{$style};
              }`,
              cb
            );
            newFileOnly = fontFileName;
          }
        }
      } else {
        console.log("File scss.fonts.css exist. For update need remove him.");
      }
    }
  });

  return app.gulp.src(app.path.srcFolder);
  function cb() {}
}

export const copyFonts = () => {
  return app.gulp.src(app.path.src.fonts)
    .pipe(app.gulp.dest(app.path.build.fonts))
}