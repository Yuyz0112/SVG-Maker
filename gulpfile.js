var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var tinypng = require('gulp-tinypng');

// 静态服务器
gulp.task('static-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("css/*.css").on('change', browserSync.reload);
    gulp.watch("js/*.js").on('change', browserSync.reload);
});

// 代理
gulp.task('proxy-sync', function() {
    browserSync.init({
        proxy: "wow.tgbus.com"
    });
});

//压缩图片
gulp.task('tinypng', function () {
    gulp.src('images/*.{png,jpg}')
        .pipe(tinypng('3KGEJm41iqv2yIjGvTQn68XyT3M4yln4'))
        .pipe(gulp.dest('dist/images'));
});