"use strict";

const gulp = require('gulp'); //gulp模块
const del = require('del'); //删除文件
const cache = require('gulp-cached'); // 缓存当前任务中的文件，只让已修改的文件通过管道
const notify = require('gulp-notify'); //notification
const rev = require('gulp-rev-append'); // 插入文件指纹（MD5）
const cssver = require('gulp-make-css-url-version'); //给css文件里引用文件加版本号（文件MD5）
const autoprefixer = require('gulp-autoprefixer'); //web前缀
const sass = require('gulp-sass'); //sass编译
const htmlmin = require('gulp-htmlmin'); //html压缩
const cssmin = require('gulp-minify-css'); //css压缩
const babel = require('gulp-babel');
const uglify = require('gulp-uglify'); //js压缩
const imagemin = require('gulp-imagemin'); //图片压缩
const pngquant = require('imagemin-pngquant'); //图片压缩
const gzip = require('gulp-gzip'); //zip压缩包
const plumber = require('gulp-plumber');
const watch = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');
const _ = require('lodash');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const changed = require('gulp-changed');
const glob = require('glob');
const es = require('event-stream');
const rename = require('gulp-rename');
const DIR = 'public/dist/';

/*gulp sass */
gulp.task('sass', function() {
    gulp.src([DIR + 'sass/*/*.scss'])
        .pipe(changed(DIR + '/css'))
        .pipe(cache('sass')) // 缓存传入文件，只让已修改的文件通过管道（第一次执行是全部通过，因为还没有记录缓存）
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(sass())
        .pipe(cssmin())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(DIR + '/css'))
        .pipe(notify({
            message: '开始编译sass'
        }));
});

gulp.task('testjs', function(done) {
    glob(DIR + 'js/index/main-**.js', function(err, files) {
        if (err) done(err);
        var tasks = files.map(function(entry) {
            return browserify({
                    entries: [entry],
                    debug: true
                })
                .transform(babelify)
                .bundle()
                .pipe(source(entry))
                .pipe(rename({
                    prefix: "app-",
                }))
                .pipe(gulp.dest('./'));
        });
        es.merge(tasks).on('end', done);
    })
});


gulp.task("watchFiles", function() {
    gulp.watch([DIR + '/sass/*/*.scss'], ['sass']);
    gulp.watch([DIR + 'js/*.js', DIR + 'js/**/*.js'], ['testjs']);
});

gulp.task("default", ['sass', 'testjs', 'watchFiles']);


/*gulp build用途：js压缩*/
gulp.task('build', function() {
    if (false) {
        del(DIR + '/jsCompressed');
        console.log('jsCompressed_删除目录')
    } else {
        gulp.src([DIR + 'js/*.js', DIR + 'js/**/*.js'])
            .pipe(changed(DIR + '/jsCompressed'))
            .pipe(sourcemaps.init())
            .pipe(babel({
                presets: ['es2015'],
                compact: false,
            }))
            .pipe(uglify({
                mangle: !true, //类型：Boolean 默认：true 是否修改变量名
                compress: true, //类型：Boolean 默认：true 是否完全压缩
                //preserveComments: 'all' //保留所有注释
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(DIR + '/jsCompressed'))
            .pipe(notify({
                message: '开始js文件压缩'
            }));
    }
});
