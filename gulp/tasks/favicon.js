export const favicon = () => {
  return app.gulp.src(`${app.path.srcFolder}/favicon.ico`, {allowEmpty: true})
    .pipe(app.gulp.dest(app.path.buildFolder))
}