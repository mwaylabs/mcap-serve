var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var connect = require('gulp-connect');
var appendit = require('appendit');
var rootApp = './example/TestApp';
var connectPort = 9100;
var configFile = '/js/mcapconfig.js';
var livereload = true;
var endpoint = '';
var open = require('gulp-open');
var os = require('os');
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
gulp.task("open", function(){
  var platform = os.platform();
  var chrome = platform === 'win32'?'chrome':'Google Chrome';
  var browsers = [chrome,'safari','firefox'];
  browsers.forEach(function(mybrowser){
    var options = {
      url: "http://localhost:"+connectPort,
      app: mybrowser
    };
    gulp.src(rootApp+"/index.html")
      .pipe(open("", options));
  });
});
gulp.task('html', function () {
  gulp.src(rootApp + '/**/*.html')
    .pipe(connect.reload());
});
gulp.task('watch', function () {
  gulp.watch([ rootApp + '/**/*.html',rootApp + '/**/*.js' ], [ 'html' ]);
});
gulp.task('default', [ 'connect','open','watch' ]);
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
