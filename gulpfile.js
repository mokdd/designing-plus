var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var autoprefixer = require("gulp-autoprefixer");
var babel = require("gulp-babel");
var svgStore = require("gulp-svgstore");
var svgMin = require("gulp-svgmin");
var cheerio = require("gulp-cheerio");

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
//svg
gulp.task('svg', function (){
  gulp.src('svg/icons/*.svg')
    .pipe(svgMin())
    .pipe(svgStore({ inlieSvg: true }))
    .pipe(cheerio({
      run: function($, file){
        var $svgTag = $('svg');

        // svg画像の属性を抽出($.mapは引数指定が逆)
        var symbols = $svgTag.find('symbol').map((idx, item) => {
            // viewBox内の値を抽出・配列に分割
            var viewBoxArr = $(item).attr('viewBox').match(/\d+/g);
            var symbolObj = {
                'id'    : $(item).attr('id'),
                'posX'  : viewBoxArr[0],
                'posY'  : viewBoxArr[1],
                'width' : viewBoxArr[2],
                'height': viewBoxArr[3]
            };
            return symbolObj;
        }).get();

        // 指定したタグと属性オブジェクトを元にタグのグループ(配列)を生成
        var tagGroupMaker = (tag, callback) => {
            var tagArr = symbols.map((item, idx) => {
                var heightArr = [];
                var reduceHeight = 0;
                if (idx > 0) {
                    var $i = 0;
                    for (; $i < idx; $i++) {
                        heightArr.push(symbols[idx-1].height);
                    }
                    reduceHeight = heightArr.reduce((prev, current)=>{
                        return parseInt(prev, 10) + parseInt(current, 10);
                    });
                }

                var buildTag = $(tag).attr(callback(item, reduceHeight));
                return buildTag;
            });

            return tagArr;
        };

        // useタグの組み立て
        var useTagGroup = tagGroupMaker(
            '<use/>',
            (item, posY) => {
                return {
                    'xlink:href': `#${item.id}`,
                    'width'     : item.width,
                    'height'    : item.height,
                    'x'         : item.posX,
                    // y座標位置の調整(重ならないようにする、余白の設定)
                    'y'         : posY
                };
            }
        );

        // viewタグの組み立て
        var viewTagGroup = tagGroupMaker(
            '<view/>',
            (item, posY) => {
                return {
                    'id'     : `${item.id}_css`,
                    'viewBox': `0 ${posY} ${item.width} ${item.height}`
                };
            }
        );

        // svg配下に組み立てたタグを追加
        $svgTag.append(useTagGroup).append(viewTagGroup);

        $svgTag.attr({
            // デフォルトは非表示
            'display': 'none',
            // cssからのハッシュリンク読み取りを有効にする設定
            'xmlns:xlink': 'http://www.w3.org/1999/xlink'
        });
        // fill属性をリセット
        $('[fill]').removeAttr('fill');

    },
      parserOptions: {xmlMode: true}
    }))
    .pipe(gulp.dest('svg'));
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
