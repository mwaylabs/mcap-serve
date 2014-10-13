'use strict';

var modifyConfig = require('../lib/modify-config.js');
require('should');
var path = require('path');

describe('modifyConfig', function () {

  var endpoint = 'http://endpoint.com';

  it('constructor', function () {
    var content = path.resolve(__dirname, 'fixtures/config.js');
    var config = modifyConfig(content, endpoint);
    config.should.containEql(endpoint);
  });

  describe('replace endpoint in config', function () {
    it('with douple quotes', function () {
      var content = '"baseUrl":"""';
      var config = modifyConfig.replaceEndpoint(content, endpoint);
      config.should.containEql(endpoint);
    });

    it('with single quotes', function () {
      var content = '\'baseUrl\':\'\'\'';
      var config = modifyConfig.replaceEndpoint(content, endpoint);
      config.should.containEql(endpoint);
    });

    it('with white spaces', function () {
      var content = '"baseUrl" : " "';
      var config = modifyConfig.replaceEndpoint(content, endpoint);
      config.should.containEql(endpoint);
    });

    it('with a set url', function () {
      var content = '"baseUrl" : "http://domain.com"';
      var config = modifyConfig.replaceEndpoint(content, endpoint);
      config.should.containEql(endpoint);
    });
  });
});
