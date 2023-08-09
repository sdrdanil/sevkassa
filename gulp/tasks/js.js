import webpack from "webpack-stream";

export const js = async () => {
  const entry = {};
  app.path.src.js.forEach(path => {
    const name = path.split('/').pop().slice(0, -3);
    entry[name] = path;
  });

  return app.gulp.src(app.path.src.js, { sourcemaps: app.isDev })
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: 'JS',
        message: 'Error: <%= error.message %>'
      })
    ))
    .pipe(webpack({
      mode: app.isBuild ? 'production' : 'development',
      output: {
        filename: '[name].min.js'
      },
      entry: entry
    }))
    .pipe(app.gulp.dest(app.path.build.js))
    .pipe(app.plugins.browsersync.stream())
}
