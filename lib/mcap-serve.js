'use strict';

var path = require('path');
var gulp = require('gulp');
var _ = require('lodash');
var connect = require('gulp-connect');
var modifyConfig = require('./modify-config.js');

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

  if (!options) {
    throw new Error('options is a required argument');
  }

  if (!options.root) {
    throw new Error('options.root is a required argument');
  }

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
            var configFilePath = path.resolve(options.root, CONFIG_FILE);
            var content = modifyConfig(configFilePath, options.endpoint);
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
