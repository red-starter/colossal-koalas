var gulp = require('gulp');
var jscs = require('gulp-jscs');

gulp.task('default', function() {
  return gulp.src(['./client/**/*.js', './server/**/*.js'], {base: '.'})
    .pipe(jscs({fix: true}))
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
    .pipe(gulp.dest('.'));
});