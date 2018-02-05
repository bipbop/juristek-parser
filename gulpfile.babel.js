import gulp from 'gulp';
import buffer from 'vinyl-buffer';
import gulpLoadPlugins from 'gulp-load-plugins';
import source from 'vinyl-source-stream';
import browserify from 'browserify';

const $ = gulpLoadPlugins();

gulp.task('default', () => browserify()
  .add('./browser.js')
  .transform('babelify', {
    global: true,
    babelrc: false,
    presets: ['env', 'stage-0'],
  })
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe($.uglyfly())
  .pipe(gulp.dest('./dist')));
