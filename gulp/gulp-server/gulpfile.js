var gulp = require('gulp');
var connect = require('gulp-connect');
var opn = require('opn');
gulp.task('server', function() {
    connect.server({
        name: '我的站点',
        port: 8888
    });
    opn('http://localhost:8888');
});
