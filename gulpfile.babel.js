import gulp from 'gulp';
import buffer from 'vinyl-buffer';
import gulpLoadPlugins from 'gulp-load-plugins';
import source from 'vinyl-source-stream';
import browserify from 'browserify';
import rollup from 'rollup-stream';
import json from 'rollup-plugin-json';

const $ = gulpLoadPlugins();

gulp.task('node', () => rollup({
  input: './index.js',
  format: 'cjs',
  plugins: [json()],
  exports: 'default',
})
  .pipe(source('node.js'))
  .pipe(buffer())
  .pipe($.babel({
    babelrc: false,
    presets: ['env', 'stage-0'],
  }))
  .pipe(gulp.dest('./dist')));

gulp.task('browser', ['node'], () => browserify()
  .add('./browser.js')
  .transform('babelify', {
    global: true,
    babelrc: false,
    presets: ['env', 'stage-0'],
  })
  .bundle()
  .pipe(source('browser.js'))
  .pipe(buffer())
  .pipe($.uglyfly())
  .pipe(gulp.dest('./dist')));

gulp.task('default', ['browser', 'node']);
