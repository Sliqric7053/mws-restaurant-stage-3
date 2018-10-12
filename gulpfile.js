// const gulp = require('gulp');
// const sass = require('gulp-sass');
// const babel = require('gulp-babel');
// const concat = require('gulp-concat');
// const terser = require('gulp-terser');
// const rename = require('gulp-rename');
// const cleanCSS = require('gulp-clean-css');
// const del = require('del');
// const browserSync = require('browser-sync').create();
// // const eslint = require('gulp-eslint');
// // const jasmine = require('gulp-jasmine-phantom');
// const sourcemaps = require('gulp-sourcemaps');
// const imagemin = require('gulp-imagemin');
// const imageminPngquant = require('imagemin-pngquant');

// const paths = {
//     styles: {
//         src: 'css/*.css',
//         dest: 'dist/css'
//     },
//     scripts: {
//         src: ['js/main.js', 'js/dbhelper.js'],
//         dest: 'dist/scripts'
//     },
//     copyHTML: {
//         src: ['./index.html', './restaurant.html'], 
//         dest: './dist'
//     },
//     resizeImg: {
//         src: 'img/*.jpg',
//         dest: 'dist/img'
//     },
//     serviceWorker: {
//         src: './sw.js',
//         dest: './dist'
//     }
// };

// /*
//  * Define our tasks using plain functions
//  */

// function clean() {
//     return del(['dist']);
// }

// function styles() {
//     return (
//         gulp
//             .src(paths.styles.src)
//             .pipe(sass())
//             .pipe(cleanCSS())
//         // pass in options to the stream
//             .pipe(
//                 rename({
//                     basename: 'main',
//                     suffix: '.min'
//                 })
//             )
//             .pipe(gulp.dest(paths.styles.dest))
//     );
// }

// function scripts() {
//     return gulp
//         .src(paths.scripts.src)
//         .pipe(sourcemaps.init())
//         .pipe(babel())
//         .pipe(concat('main.min.js'))
//         .pipe(terser())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(paths.scripts.dest));
// }

// function copyHTML() {
//     return gulp.src(paths.copyHTML.src).pipe(gulp.dest(paths.copyHTML.dest));
// }

// function serviceWorker() {
//     return gulp.src(paths.serviceWorker.src).pipe(gulp.dest(paths.serviceWorker.dest));
// }

// function resizeImg() {
//     return gulp.src(paths.resizeImg.src)
//         .pipe(imagemin({
//             progressive: true, // Progressive rendering loads an image in layers where each layer makes the image more detailed. It can make a page feel faster than typical rendering line by line.
//             use: [imageminPngquant()]
//         }))
//         .pipe(gulp.dest(paths.resizeImg.dest));
// }

// function watch() {
//     browserSync.init({
//         server: './dist'
//     });
//     gulp.watch(paths.scripts.src, scripts).on('change', browserSync.reload);
//     gulp.watch(paths.styles.src, styles).on('change', browserSync.reload);
//     gulp.watch(paths.copyHTML.src, copyHTML).on('change', browserSync.reload);
// }

// /*
//  * You can use CommonJS `exports` module notation to declare tasks
//  */
// exports.clean = clean;
// exports.styles = styles;
// exports.copyHTML = copyHTML;
// exports.serviceWorker = serviceWorker;
// exports.resizeImg = resizeImg;
// // exports.lint = lint;
// exports.scripts = scripts;
// exports.watch = watch;

// /*
//  * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
//  */
// const build = gulp.series(
//     clean,
//     copyHTML,
//     styles,
//     resizeImg,
//     scripts,
//     serviceWorker,
//     watch
// );

// /*
//  * You can still use `gulp.task` to expose tasks
//  */
// gulp.task('build', build);

// /*
//  * Define default task that can be called by just running `gulp` from cli
//  */
// gulp.task('default', build);

var gulp = require('gulp');
var del = require('del');
var inject = require('gulp-inject');
// var webserver = require('gulp-webserver');
var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

var paths = {
  src: '/**/*',
  srcIndexHTML: './index.html',
  srcRestaurantHTML: './restaurant.html',
  srcCSS: 'css/*.css',
  srcJS: ['js/main.js', 'js/dbhelper.js'],
  srcRestaurantJS: 'js/restaurant_info.js',

  tmp: 'tmp',
  tmpIndexHTML: 'tmp/index.html',
  tmpRestaurantHTML: 'temp/restaurant.html',
  tmpCSS: 'tmp/**/*.css',
  tmpJS: 'tmp/**/*.js',
  tmpRestaurantJS: 'tmp/js/**/*.js',

  dist: 'dist',
  distIndex: 'dist/index.html',
  distCSS: 'dist/**/*.css',
  distJS: 'dist/**/*.js'
};

/**
 * DEVELOPMENT
 */
gulp.task('html', function () {
  return gulp.src(paths.srcIndexHTML).pipe(gulp.dest(paths.tmp));
});
gulp.task('html1', function () {
  return gulp.src(paths.srcRestaurantHTML).pipe(gulp.dest(paths.tmp));
});
gulp.task('css', function () {
  return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
});
gulp.task('js', function () {
  return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});
gulp.task('js1', function () {
  return gulp.src(paths.srcRestaurantJS).pipe(gulp.dest(paths.tmp));
});

gulp.task('copy', ['html', 'html1', 'css', 'js', 'js1']);

gulp.task('inject', ['copy'], function () {
  var css = gulp.src(paths.tmpCSS);
  var js = gulp.src(paths.tmpJS);
  return gulp.src(paths.tmpIndexHTML)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( js, { relative:true } ))
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('inject2', ['copy'], function () {
  var css = gulp.src(paths.tmpCSS);
  var js = gulp.src(paths.tmpRestaurantJS);
  return gulp.src(paths.tmpRestaurantHTML)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( js, { relative:true }, {name: 'head'} ))
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('serve', ['inject', 'inject2'], function () {
//   return gulp.src(paths.tmp)
//     .pipe(webserver({
//       port: 3000,
// 			livereload: true
//     }));
browserSync.init({
     server: paths.tmp
    });
    gulp.watch(paths.tmp).on('change', browserSync.reload);
});

gulp.task('watch', ['serve'], function () {
	gulp.watch(paths.src, ['inject']);
});

gulp.task('default', ['watch']);
/**
 * DEVELOPMENT END
 */



/**
 * PRODUCTION
 */
gulp.task('html:dist', function () {
  return gulp.src(paths.srcRestaurantHTML)
    .pipe(htmlclean())
    .pipe(gulp.dest(paths.dist));
});
gulp.task('css:dist', function () {
  return gulp.src(paths.srcCSS)
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist));
});
gulp.task('js:dist', function () {
  return gulp.src(paths.srcJS)
    .pipe(concat('script.min.js'))
    // .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest(paths.dist));
});
gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist']);
gulp.task('inject:dist', ['copy:dist'], function () {
  var css = gulp.src(paths.distCSS);
  var js = gulp.src(paths.distJS);
  return gulp.src(paths.distIndex)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( js, { relative:true } ))
    .pipe(gulp.dest(paths.dist));
});
gulp.task('build', ['inject:dist']);
/**
 * PRODUCTION END
 */

gulp.task('clean', function () {
  del([paths.tmp, paths.dist]);
});