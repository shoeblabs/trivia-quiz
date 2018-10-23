const gulp = require('gulp'),
        runSequence = require('run-sequence'),
        cssnano = require('gulp-cssnano'),
        jshint = require('gulp-jshint'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        hash = require('gulp-hash-filename'),
        concat = require('gulp-concat'),
        notify = require('gulp-notify'),
        templateCache = require('gulp-angular-templatecache'),
        cache = require('gulp-cache'),
        connect = require('gulp-connect'),
        gulpFilter = require('gulp-filter'),
        mainBowerFiles = require('main-bower-files'),
        inject = require('gulp-inject'),
        ngAnnotate = require('gulp-ng-annotate');        
        del = require('del');

var src = {
    js:'./src/app/**/*.js',
    css: './src/assets/css/*.css',
    bower: './src/bower_components',
    view : './src/app/views/**/*.html',
    images: './src/assets/images/**/*',
    manifest: './src/app/**/*.json',
    worker: './src/app/service-worker.js'
};

var out = {
    css :'./dist/css',
    js : './dist/js',
    view : './dist/app/views',
    images:'./dist/assets/images',
    manifest: './dist',
    worker: './dist'
};

var js_filter = gulpFilter(['**/*.js','!**/*.min.js']);
var css_filter = gulpFilter(['**/*.css','!**/*.min.css']);

//bundle and minify app js files
gulp.task('appJs', function() {
    return gulp.src(['./src/app/main.js','./src/app/main.config.js','./src/app/main.router.js','./src/app/controllers/**/*.js','./src/app/services/**/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.bundle.js'))
        .pipe(hash({ "format": "{name}.{hash}{ext}"}))
        .pipe(gulp.dest(out.js))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename(function (path) {path.basename += ".min";}))
        .pipe(gulp.dest(out.js))
        .pipe(notify({ message: 'App Js bundling complete' }));
});

//bundle and minify vendor js files
gulp.task('vendorJs', function() {
    return gulp.src(mainBowerFiles({
            paths: {
                bowerDirectory: src.bower,
                bowerrc: './.bowerrc',
                bowerJson: './bower.json'
            }
        }))
        .pipe(js_filter)
        .pipe(concat('vendor.bundle.js'))
        .pipe(hash({ "format": "{name}.{hash}{ext}"}))
        .pipe(gulp.dest(out.js))
        .pipe(rename(function (path) {path.basename += ".min";}))
        .pipe(uglify())
        .pipe(gulp.dest(out.js))
        .pipe(notify({ message: 'vendor Js bundling complete' }));
});

//bundle and minify vendor css files
// gulp.task('vendorCss', function() {
//     return gulp.src(mainBowerFiles({
//             paths: {
//                 bowerDirectory: src.bower,
//                 bowerrc: './.bowerrc',
//                 bowerJson: './bower.json'
//             }
//         }))
//         .pipe(css_filter)
//         .pipe(concat('vendor.bundle.css'))
//         .pipe(hash({ "format": "{name}.{hash}{ext}"}))
//         .pipe(gulp.dest(out.css))
//         .pipe(rename(function (path) {path.basename += ".min";}))
//         .pipe(cssnano())
//         .pipe(gulp.dest(out.css))
//         .pipe(notify({ message: 'vendor Css bundling complete' }));
// });

//bundle and minify app css files
gulp.task('appCss', function() {
    return gulp.src([src.css])
        .pipe(concat('app.bundle.css'))
        .pipe(hash({ "format": "{name}.{hash}{ext}"}))
        .pipe(gulp.dest(out.css))
        .pipe(rename(function (path) {path.basename += ".min";}))
        .pipe(cssnano({zindex: false})) //prevent rendering zindex
        .pipe(gulp.dest(out.css))
        .pipe(notify({ message: 'App Js bundling complete' }));
});

//copy view files to dist
gulp.task('moveView', function() {
    return gulp.src(src.view)
        .pipe(gulp.dest(out.view));
});
//copy images to dist
gulp.task('moveImages', function() {
    return gulp.src(src.images)
        .pipe(gulp.dest(out.images));
});
//copy manifest files to dist
gulp.task('moveManifest', function() {
    return gulp.src(src.manifest)
        .pipe(gulp.dest(out.manifest));
});

gulp.task('moveServiceWorker', function() {
    return gulp.src(src.worker)
        .pipe(gulp.dest(out.worker));
});

//inject dist files in index.html
gulp.task('injectIndex', function () {
  var target = gulp.src('./src/temp/index.html');
  var source = gulp.src(['./js/vendor.bundle.*.min.js','./js/app.bundle.*.min.js','./css/app.bundle.*.min.css'],{read: false,cwd: __dirname + '/dist'});
  return target
    .pipe(inject(source))
    .pipe(gulp.dest('./dist'));
});

//use to clean build directory
gulp.task('clean', function() {
    return del([out.js,out.css,out.view,'./dist/index.html']);
});

//use to clear cache
gulp.task('clearCache', function() {
    cache.clearAll();
});

gulp.task('default',function(callback) {
  runSequence('clean',['appCss','appJs','vendorJs','moveView','moveImages','moveManifest',],'injectIndex',callback);
});
