var gulp = require('gulp');
var browserify = require('browserify');
var del = require('del');
var uglify = require('gulp-uglifyjs');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('clean', function(cb) {
  del('dist/', cb);
});

gulp.task('compress', function() {
  return  browserify({
    entries: './index.js',
    standalone: 'SpriteLoop',
    debug: true
  })
  .bundle()
  .pipe(source('spriteloop.js'))
  .pipe(buffer())
  .pipe(uglify({
    compress: {
      booleans: true,
    }
  }))
  .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['clean'], function() {
  return gulp.start('compress');
});
