// var gulp = require('gulp'),  
//     pug = require('gulp-pug');
//     // run this task by typing in gulp pug in CLI
    
//     gulp.task('pug', function() { 
//     return gulp.src('templates/*.pug')
//         .pipe(pug()) // pipe to pug plugin
//         .pipe(gulp.dest('build')); // tell gulp our output folder
// });

// Modules
const {src, dest, watch, series, parallel} = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// File path variables
const files = {
    scssPath: 'src/scss/**/*.scss',
    jsPath: 'src/js/**/*.js'
}

//console.log(sass, files);
// // var gulp = require('gulp');
// //     // run this task by typing in gulp pug in CLI
// //     gulp.task('default', gulp.series('sass', 'js', 'watch'));
// //     gulp.watch('app/scss/*.scss', gulp.series('sass'));

// Tasks
function scssTask() {
    return src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss( [autoprefixer()] ))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'))
}

function jsTask(){
    return src([files.jsPath])
        .pipe(concat('all.js'))
        //.pipe(uglify())
        .pipe(dest('dist')
    );
}

// Cache bust Tasks
var cbString = new Date().getTime();
function cacheBustTask(){
    return src(['index.html'])
        .pipe(replace(/cb=\d+/, 'cb=' + cbString))
        .pipe(dest('.'));
}

// Watch tasks
function watchTask(){
    watch(
        [files.scssPath, files.jsPath],
        parallel(scssTask, jsTask)
    );
}

// Default task
exports.default = series(
    parallel(scssTask, jsTask), 
    cacheBustTask,
    watchTask
);

//gulp.task('default', gulp.series('sass', 'js', 'watch'));
//gulp.watch('app/scss/*.scss', gulp.series('sass'));