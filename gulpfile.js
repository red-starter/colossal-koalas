var gulp = require('gulp');
var jscs = require('gulp-jscs');
var shell = require('gulp-shell');
var env = require('gulp-env');

gulp.task('style', function() {
  return gulp.src(['./client/**/*.js', './server/**/*.js'], {base: '.'})
    .pipe(jscs({fix: true}))
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
    .pipe(gulp.dest('.'));
});

gulp.task('set-env',function() {
  env({
    file: '.env.json'
  });
});

gulp.task('set-test-env', function() {
  env({
    file: '.env.json',
    vars: {
      NODE_ENV: 'test'
    }
  });
});

gulp.task('set-reset-env', function() {
  env({
    file: '.env.json',
    vars: {
      NODE_ENV: 'reset'
    }
  });
});

gulp.task('start', ['set-env'], shell.task('node ./server/server.js'));

gulp.task('dev-start', ['set-test-env'], shell.task('nodemon ./server/server.js'));

gulp.task('test', ['set-test-env'], shell.task('node ./server/server.js & mocha -c ./server/spec/spec.js; pkill -n node'));

gulp.task('db-test', ['set-test-env'], shell.task('mocha -c ./server/database/spec/spec.js'));

gulp.task('db-reset', ['set-reset-env'], shell.task('node ./server/database/interface.js'));