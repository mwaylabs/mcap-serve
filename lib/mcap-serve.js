var fs = require('fs');
var path = require('path');
var domain = require('domain');
var gulp = require('gulp');
var connect = require('gulp-connect');
var appendit = require('appendit');
var VError = require('verror');

var rootApp = './example/TestApp';
var configFile = '/js/mcapconfig.js';
var livereload = true;
var endpoint = '';
var done;

var watchFiles = [
  rootApp + '/**/*.html',
  rootApp + '/**/*.js',
  rootApp + '/**/*.css'
];

var editMcapConfig = function () {

    var source = path.resolve(rootApp) + configFile;

    var content = appendit({
        source: fs.readFileSync(source, 'utf8'),
        anchor: '//current:stage:identifier',
        content: [
            'window.mCAPConfig.defaultStage = \'serve\''
        ]
    });

    return appendit({
        source: content,
        anchor: '//current:stage:case',
        content: [
                'case "serve": return \'' + endpoint + '\'; break;'
        ]
    });

};

gulp.task('connect', function () {

    var d = domain.create();
    d.on('error', function(err) {
      if (err.code === 'EADDRINUSE') {
        done(new VError('There is another process already listening at port 8080'));
      } else {
        done(new VError('Connect error: %s', err));
      }
    });
    d.run(function() {
      connect.server({
          root: rootApp,
          livereload: livereload,
          middleware: function () {
              return [
                  function (req, res, next) {
                      var url = decodeURIComponent(req._parsedUrl.path);
                      if (url === configFile) {
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
});

gulp.task('html', function () {
    gulp.src(watchFiles)
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(watchFiles, ['html']);
});

gulp.task('default', ['connect', 'watch']);

var run = function (options, cb) {
    done = cb;
    rootApp = options.root || rootApp;

    if (typeof options.enableLivereload === 'boolean') {
        livereload = options.enableLivereload;
    }

    endpoint = options.endpoint;

    gulp.start('default');
};

module.exports = run;
