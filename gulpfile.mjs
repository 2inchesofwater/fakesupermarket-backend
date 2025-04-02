import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);

function buildStyles() {
  return gulp.src('2inchesofwater/src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('assets/css'));
}

function watchFiles() {
  gulp.watch('2inchesofwater/src/**/*.scss', buildStyles);
}

// Default task
const defaultTask = gulp.series(buildStyles, watchFiles);

export { buildStyles, watchFiles };
export default defaultTask;