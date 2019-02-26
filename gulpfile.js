var gulp = require('gulp');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var useref = require('gulp-useref');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var gulpIf = require('gulp-if');
var minify = require("gulp-babel-minify");
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();


gulp.task('images', function(){
	return gulp
	.src("app/data/photos/*.{jpg,jpeg}")
	.pipe(cache(imagemin({optimizationLevel:3, progressive:true, interlaced:true})))
	.pipe(gulp.dest("dist/data/photos/")) 
});

gulp.task('useref', function () {
    return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.css', minifyCSS()))
    .pipe(gulpIf('*.js',  minify()))

    .pipe(gulp.dest('dist'));
});

gulp.task('serve', function(done) {

    browserSync.init({
		server: {
    		baseDir: './dist'
    	},
    })

    gulp.watch("app/*.html", gulp.series('useref'));
	gulp.watch("app/data/photos/*.{jpg,jpeg}", gulp.series('images'));
	gulp.watch("app/data/*.js", gulp.series('useref'));
	gulp.watch("app/css/*.css", gulp.series('useref'));
	gulp.watch("app/js/*.js", gulp.series('useref'));
    gulp.watch("./dist/**/*.*").on('change', () => {
      browserSync.reload();
      done();
    });
  

    done();
});


gulp.task('default', gulp.series('useref','images','serve'));







