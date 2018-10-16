const gulp = require('gulp');

const babel = require('gulp-babel');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');

const jsConfig = require('./source/javascripts/config');

let jsTasks = [];

for (config of jsConfig) {
  const taskName = `${config.name}-js`;
  jsTasks.push(taskName);

  gulp.task(taskName, [], function() {
    const files = config.files.map(f => `./source/javascripts/${f}`);
    return gulp.src(files)
      .pipe(plumber())
      .pipe(concat(`${config.name}.js`))
      .pipe(babel({
        presets: [
          ['@babel/env', {
            modules: false
          }]
        ]
      }))
      .pipe(uglify())
      .pipe(gulp.dest('./tmp/javascripts'))
  });
}

gulp.task('js', jsTasks, function() {
  return
});

// TODO: Add JS watch task
