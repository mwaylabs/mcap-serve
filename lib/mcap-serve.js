var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var connect = require('gulp-connect');
var appendit = require('appendit');
var rootApp = './example/TestApp';
var connectPort = 9200;
var configFile = '/js/mcapconfig.js';
var livereload = true;
var endpoint = '';
var editMcapConfig = function () {
  var source = path.resolve(rootApp) + configFile;
  var content = appendit(
    {
      source : fs.readFileSync(source, 'utf8'),
      anchor : '//current:stage:identifier',
      content: [
        'window.mCAPConfig.defaultStage = \'serve\''
      ]
    });

  return appendit(
    {
      source : content,
      anchor : '//current:stage:case',
      content: [
        'case "serve": return \'' + endpoint + '\'; break;'
      ]
    });
};
gulp.task('connect', function () {
  connect.server(
    {
      root      : rootApp,
      port      : connectPort,
      livereload: livereload,
      middleware: function () {
        return [
          function (req, res, next) {
            var url = decodeURIComponent(req._parsedUrl.path);
            if ( url === configFile ) {
              var content = editMcapConfig();
              res.write(content, 'utf8');
              res.end();
            } else {
              next();
            }
          }
        ];
      }
    });
});
gulp.task('html', function () {
  gulp.src(rootApp + '/**/*.html')
    .pipe(connect.reload());
});
gulp.task('watch', function () {
  gulp.watch([ rootApp + '/**/*.html' ], [ 'html' ]);
});
gulp.task('default', [ 'connect', 'watch' ]);
var run = function (options) {
  rootApp = options.root || rootApp;
  if ( typeof options.enableLivereload === 'boolean' ) {
    livereload = options.enableLivereload;
  }
  if(typeof options.port === 'number'){
    connectPort = options.port;
  }
  gulp.start('default',function(){});
};

module.exports = run;
