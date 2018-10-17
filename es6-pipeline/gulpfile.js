const gulp = require('gulp');

const babel = require('gulp-babel');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');

const jsConfig = require('./source/javascripts/config');
const srcDir = './source/javascripts';
const destDir = './tmp/javascripts';

let jsTasks = [];

for (key in jsConfig) {
  const name = key;
  const config = jsConfig[key];

  const taskName = `${name}-js`;
  jsTasks.push(taskName);

  gulp.task(`${taskName}-deps`, [], function() {
    if (!config.dependencies) return true;

    const files = config.dependencies.map(f => {
      if (f[0] == '~') return `${f.replace('~', './node_modules/')}.js`
      return `${srcDir}/${f}.js`
    });

    return gulp.src(files)
      .pipe(plumber())
      .pipe(concat(`${name}.deps.js`))
      .pipe(gulp.dest(destDir))
  });

  gulp.task(`${taskName}-files`, function() {
    const files = config.files.map(f => `${srcDir}/${f}.js`);
    return gulp.src(files)
      .pipe(plumber())
      .pipe(concat(`${name}.files.js`))
      .pipe(babel({
        presets: [
          ['@babel/env', {
            modules: false
          }]
        ]
      }))
      .pipe(uglify())
      .pipe(gulp.dest(destDir))
  });

  gulp.task(taskName, [`${taskName}-deps`, `${taskName}-files`], function() {
    return gulp.src([
        `${destDir}/${name}.deps.js`,
        `${destDir}/${name}.files.js`
      ])
      .pipe(plumber())
      .pipe(concat(`${name}.js`))
      .pipe(gulp.dest(destDir))
  });
}

gulp.task('js', jsTasks, () => {
  return
});

gulp.task('watch-js', function() {
  gulp.watch(`${srcDir}/**/*.js`, ['js'], () => {
    return
  });
});
