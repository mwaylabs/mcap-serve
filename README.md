# mcap-serve 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Coverage Status][coveralls-image]][coveralls-url]

Runs a local webserver with livereload.

## Install

```bash
$ npm install mcap-serve

```

## Usage

```javascript
var mcapServe = require('./lib/mcap-serve');

mcapServe({
    root: './example/MyApp/client',
    enableLivereload: true,
    port: 8081,
    open: true,
    endpoint: 'http//mcap.com/mway/MyApp/api'
});
```

## Example

```bash
node example/run.js
open http://localhost:9200/
```


[npm-url]: https://npmjs.org/package/mcap-serve
[npm-image]: https://badge.fury.io/js/mcap-serve.svg
[travis-url]: https://travis-ci.org/mwaylabs/mcap-serve
[travis-image]: https://travis-ci.org/mwaylabs/mcap-serve.svg?branch=master
[daviddm-url]: https://david-dm.org/mwaylabs/mcap-serve.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/mwaylabs/mcap-serve
[coveralls-url]: https://coveralls.io/r/mwaylabs/mcap-serve
[coveralls-image]: https://coveralls.io/repos/mwaylabs/mcap-serve/badge.png
