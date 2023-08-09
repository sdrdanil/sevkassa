import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';

export const optimizeImages = () => {
  const pathImg = `${app.path.srcFolder}/img`;

  return app.gulp
    .src(app.path.src.origimages)
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'OPTIMIZE IMAGES',
          message: 'Error: <%= error.message %>',
        }),
      ),
    )
    .pipe(app.plugins.newer(pathImg))
    .pipe(webp())
    .pipe(app.gulp.dest(pathImg))
    .pipe(app.gulp.src(app.path.src.origimages))
    .pipe(app.plugins.newer(pathImg))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 5, // 0 to 7
      }),
    )
    .pipe(app.gulp.dest(pathImg));
};
