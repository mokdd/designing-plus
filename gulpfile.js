var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var autoprefixer = require("gulp-autoprefixer");
var babel = require("gulp-babel");

// SassとCssの保存先を指定
gulp.task('sass', function(){
  gulp.src('./sass/**/*.scss')
    .pipe(plumber())
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./css/'));
});
//babel
gulp.task("babel-build", function (){
  return gulp.src("./scripts/**/*.js")
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest("js"));
});

//自動監視のタスクを作成(sass-watchと名付ける)
gulp.task('sass-watch', ['sass'], function(){
  var watcher = gulp.watch('./sass/**/*.scss', ['sass']);
  watcher.on('change', function(event) {
  });
});
gulp.task('babel-watch', function(){
  gulp.watch('./scripts/**/*.js', ['babel-build'])
});

// タスク"task-watch"がgulpと入力しただけでdefaultで実行されるようになる
gulp.task('default', ['sass-watch', 'babel-watch']);
