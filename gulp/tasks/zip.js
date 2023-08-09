import { deleteAsync } from 'del';
import pluginZip from "gulp-zip";

export const zip = () => {
  deleteAsync(`./${app.path.rootFolder}.zip`);
  return app.gulp.src(`${app.path.buildFolder}/**/*.*`)
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: 'ZIP',
        message: 'Error: <%= error.message %>'
      })
    ))
    .pipe(pluginZip(`${app.path.rootFolder}.zip`))
    .pipe(app.gulp.dest('./'))
}