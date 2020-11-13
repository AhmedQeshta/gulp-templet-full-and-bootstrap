var Gulp = require('gulp');
var BrowserSync = require('browser-sync');
var Autoprefixer = require('gulp-autoprefixer');
var Concat = require('gulp-concat');
var Imagemin = require('gulp-imagemin');
var Rename = require('gulp-rename');
var Sass = require('gulp-sass');
var Sourcemaps = require('gulp-sourcemaps');
var Uglify = require('gulp-uglify');

// style
async function styles() {
    return Gulp.src('src/scss/styles.scss')
        .pipe(Sourcemaps.init())
        .pipe(Sass({ outputStyle:'compressed'}))
        .on('error',Sass.logError)
        .pipe(Autoprefixer())
        .pipe(Sourcemaps.write())
        .pipe(Rename('main.min.css'))
        .pipe(Gulp.dest('dist/css'))
        .pipe(BrowserSync.stream());
}

async function bootstrap_styles() {
    return Gulp.src('src/bootstrap/bootstrap.scss')
        .pipe(Sourcemaps.init())
        .pipe(Sass({ outputStyle:'compressed'}))
        .on('error',Sass.logError)
        .pipe(Autoprefixer())
        .pipe(Sourcemaps.write())
        .pipe(Rename('bootstrap.min.css'))
        .pipe(Gulp.dest('dist/css'))
        .pipe(BrowserSync.stream());
}

async function vendor_styles() {
    return Gulp.src('src/plugins/**/*.css')
        .pipe(Sourcemaps.init())
        .pipe(Sourcemaps.write())
        .pipe(Concat('vendor.min.css'))
        .pipe(Gulp.dest('dist/css'))
        .pipe(BrowserSync.stream());
}

async function compress_images() {
    return Gulp.src('src/images/**/*.*')
        .pipe(Imagemin([
            Imagemin.gifsicle({interlaced:true}),
            Imagemin.mozjpeg({progressive:true}),
            Imagemin.optipng({optimizationLevel:5}),
            Imagemin.svgo({
                plugins:[
                    {removeViewBox : true},
                    {cleanupIDs : false}
                ]
            }),
        ]))
        .pipe(Gulp.dest('dist/images'))
        .pipe(BrowserSync.stream());
}

//script
async function scripts() {
    return Gulp.src('src/js/**/*.js')
        .pipe(Uglify())
        .pipe(Rename('main.min.js'))
        .pipe(Gulp.dest('dist/js'))
        .pipe(BrowserSync.stream());
}
async function vendor_scripts() {
    return Gulp.src('src/plugins/**/*.js')
        .pipe(Uglify())
        .pipe(Concat('vendor.min.js'))
        .pipe(Gulp.dest('dist/js'))
        .pipe(BrowserSync.stream());
}



// watch
function watch(){
    BrowserSync.init({
        server:{
            baseDir:'./'
        }
    })
    Gulp.watch('src/scss/**/*.scss', styles);
    Gulp.watch('src/bootstrap/**/*.scss', bootstrap_styles);
    Gulp.watch('src/images/**/*.*', compress_images);
    Gulp.watch('src/plugins/**/*.css', vendor_styles);
    Gulp.watch('src/plugins/**/*.js', vendor_scripts);
    Gulp.watch('src/js/**/*.js', scripts);
    Gulp.watch('./*.html').on('change',BrowserSync.reload);
}

// Export All Functions
exports.default =  Gulp.series(
    Gulp.parallel([styles,bootstrap_styles]),
    Gulp.parallel([vendor_styles,scripts,vendor_scripts]),
    Gulp.parallel([vendor_styles,scripts,vendor_scripts]),
    compress_images,
    watch,
)
