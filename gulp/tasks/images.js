import webp from "gulp-webp";
import imagemin from "gulp-imagemin";

export const images = () => {
  return app.gulp.src(app.path.src.images)
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.gulp.src(app.path.src.svg))
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.plugins.browsersync.stream())
}