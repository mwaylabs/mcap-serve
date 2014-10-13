
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var _ = require('lodash');
var connect = require('gulp-connect');

var CONFIG_FILE = '/js/config.js';

var defaults = {
  port: 9100,
  enableLivereload: true,
  livereloadPort: 12345,
  open: true
};

var watchGlob = [
  '*.html',
  'js/**/*.js',
  'css/**/*.css',
  'img/**/*',
  'modules/**/*',
  'templates/**/*.html'
];

/**
 * Replace the baseUrl value, set in the js/config.js
 * This is needed to point the apps server endpoint
 * to the given endpoint.
 *
 * @param  {string} rootApp
 * @param  {string} endpoint
 * @return {string}
 */
var modifyConfigsBaseUrl = function (rootApp, endpoint) {
    var source = path.resolve(rootApp) + CONFIG_FILE;
    var content = fs.readFileSync(source, 'utf8');
    return content.replace(/(['"]baseUrl['"].*?['"]).*?(['"])/g, '$1' + endpoint + '$2');
};

/**
 * Starts a local webserver with the given options
 *
 * @param  {object} options
 * {
 *   root: ./mcap-project/client',
 *   enableLivereload: true,
 *   port: 8081,
 *   open: true,
 *   endpoint: 'http//mcap.com/api/'
 * }
 */
module.exports = function (options) {

  _.defaults(options, defaults);

  // Add root path to each glob
  watchGlob = watchGlob.map(function(item) {
    return path.resolve(options.root, item);
  });

  if (options.enableLivereload) {
    options.livereload = true;
  }

  if (options.endpoint) {
    options.middleware = function () {
      return [
        function (req, res, next) {
          var url = decodeURIComponent(req._parsedUrl.path);
          if (url === CONFIG_FILE) {
            var content = modifyConfigsBaseUrl(options.root, options.endpoint);
            res.write(content, 'utf8');
            res.end();
          } else {
            next();
          }
        }
      ];
    };
  }

  gulp.task('serve', function() {
    connect.server(options);
  });

  gulp.task('html', function () {
    gulp.src(watchGlob)
      .pipe(connect.reload());
  });

  gulp.task('watch', function () {
    gulp.watch(watchGlob, [ 'html' ]);
  });

  gulp.task('default', [ 'serve', 'watch' ]);

  gulp.start('default', function() {
    if (options.open) {
      require('opn')('http://localhost:' + options.port);
    }
  });
};
