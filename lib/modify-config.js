'use strict';

var fs = require('fs');

/**
 * Replace the baseUrl value, set in the js/config.js
 * This is needed to point the apps server endpoint
 * to the given endpoint.
 *
 * @param  {string} configFile
 * @param  {string} endpoint
 * @return {string}
 */
var modifyConfig = function (configFile, endpoint) {
    var content = fs.readFileSync(configFile, 'utf8');
    return modifyConfig.replaceEndpoint(content, endpoint);
};

modifyConfig.replaceEndpoint = function(content, endpoint) {
  return content.replace(/(['"]baseUrl['"].*?['"]).*?(['"])/g, '$1' + endpoint + '$2');
};

module.exports = modifyConfig;
