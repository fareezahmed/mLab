var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');

gulp.task('babel', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('babel:watch', function () {
  gulp.watch('./src/**/*.js', ['babel']);
});

gulp.task('sass', function () {
  return gulp.src('./src/sass/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/*.sass', ['sass']);
});

gulp.task('pug', function(){
  gulp.src('./pug/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('./'))
});

gulp.task('watch', function(){
  gulp.watch('./src/pug/*.pug',['pug'])
});

gulp.task('autoprefixer', () =>
    gulp.src('src/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./style'))
);

gulp.task('auto:watch', function(){
  gulp.watch('./src/css/*.css',['autoprefixer'])
});

gulp.task('default', ['watch','sass:watch','babel:watch', 'auto:watch'])
