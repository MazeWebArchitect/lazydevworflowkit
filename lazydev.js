/**
 * LazyDev Workflow Kit Gulp File
 * Created by Matthias Held | matthias@riadboxes.de
 * Version: 1.0.0
 */
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// BUILD DEPENDENCIES
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Main Plugins
var gulp            = require('gulp');
var gulpSequence    = require('gulp-sequence');
var autoprefixer    = require('autoprefixer');
var minifyjs        = require('gulp-uglify');
var sourcemaps      = require('gulp-sourcemaps');
var cssmin          = require('gulp-cssmin');
var postcss         = require('gulp-postcss');
var rename          = require('gulp-rename');

browserSync         = require('browser-sync').create();
var reload          = browserSync.reload;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// SET UP GULP TASKS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// For production
// -------------------------------------------------------------------------

// BrowserSync start server
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        proxy: 'mywordpress.dev' //Change this to your local dev Url
    });
});

// BrowserSync watch for changes to files
gulp.task('watch', ['browser-sync'], function() {
    // Watch Plugin folder
    gulp.watch('wp-content/plugins/**/*.*', reload);
    // Watch Theme folder
    gulp.watch('wp-content/themes/**/*.*', reload);
});

// -------------------------------------------------------------------------

// Finalize the project files
// -------------------------------------------------------------------------

// Minify the js [Saved in final/minifyjs]
gulp.task('minifyjs', function () {
    gulp.src('wp-content/themes/**/*.js')
        .pipe(minifyjs())
        .pipe(gulp.dest('final/minifyjs'))
});

// Autoprefix the css [Saved in final/autoprefixedcss]
gulp.task('autoprefixer', function () {
    return gulp.src('wp-content/themes/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('final/autoprefixedcss'));
});

// Takes the autoprefixed css and minimizes it [Saved in final/minimizedcss]
gulp.task('minimizecss', function () {
    gulp.src('final/autoprefixedcss/**/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('final/minimizedcss/'));
});
// -------------------------------------------------------------------------


// In Production
gulp.task('In Production', ['browser-sync', 'watch']);

// Finalize Project Files
gulp.task('Finalize Project Files', gulpSequence(['autoprefixer', 'minifyjs'],'minimizecss'));


