import fileInclude from 'gulp-file-include';
import versionNumber from 'gulp-version-number';

export const html = () => {
  return app.gulp
    .src(app.path.src.html)
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'HTML',
          message: 'Error: <%= error.message %>',
        }),
      ),
    )
    .pipe(fileInclude())
    .pipe(app.plugins.replace(/@img\//g, './img/'))
    .pipe(
      app.plugins.if(
        app.isBuild,
        versionNumber({
          value: '%DT%',
          append: {
            key: '_v',
            cover: 0,
            to: [
              {
                type: 'css',
                files: ['style.min.css'],
              },
              {
                type: 'js',
                files: ['app.min.js'],
              },
            ],
          },
          output: {
            file: 'gulp/version.json',
          },
        }),
      ),
    )
    .pipe(app.gulp.dest(app.path.build.html))
    .pipe(app.plugins.browsersync.stream());
};
