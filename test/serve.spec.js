'use strict';

var mcapServe = require('..');
require('should');

describe('mcapServe', function () {

  describe('instantiating', function() {

    it('without options', function () {
      (function() {
        mcapServe();
      }).should.throw('options is a required argument');
    });

    it('without options.root', function () {
      (function() {
        mcapServe({});
      }).should.throw('options.root is a required argument');
    });
  });

});
