var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    notify = require('gulp-notify'),
    gutil = require('gulp-util'),
    livereload = require('gulp-livereload');
    plumber = require('gulp-plumber');
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

gulp.task('uglify', function() {
  return gulp.src('src/assets/js/application.js')
    .pipe(uglify())
    .pipe(rename('application.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('less', function () {
    return gulp.src('src/assets/less/style.less')
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(less({compress: true}))
    .pipe(autoprefixer('last 10 versions', 'ie 9'))
    .pipe(minifyCSS({keepBreaks: false}))
    .pipe(gulp.dest('src/assets/css/'))
    .pipe(gulp.dest('build/css/'))
    .pipe(livereload());
});

// Watch Files For Changes
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/assets/js/**/*.js', ['uglify']);
    gulp.watch('src/assets/less/**/*.less', ['less']);
});

gulp.task('default', ['watch']);