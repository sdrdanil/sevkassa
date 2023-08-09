import svgSprite from 'gulp-svg-sprite';

export const sprite = () => {
  return app.gulp
    .src(app.path.src.svgicons)
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'SVG',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(
      svgSprite({
        svg: {
          transform: [
            function (svg) {
              return svg
                .replace(/(<style.*?<\/style>)/g, '')
                .replace(/xml.*?svg.*?>/, '$&<style>:root>svg{display:none}:root>svg:target{display:block}</style>')
                .replace(/xml.*?svg/, '$& fill="none" stroke="none"')
                .replace(/(style=".*?")/g, '');
            },
          ],
        },
        mode: {
          stack: {
            sprite: '../sprite.svg',
            example: true,
          },
        },
      })
    )
    .pipe(app.gulp.dest(`${app.path.srcFolder}/img`));
};
