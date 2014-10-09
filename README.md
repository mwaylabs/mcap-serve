# mcap-serve 

Runs a local webserver with livereload.

## Install

```bash
$ npm install mcap-serve

```

## Usage

```javascript
var mcapServe = require('./lib/mcap-serve');
mcapServe({
    root: './example/TestApp/client',
    enableLivereload: true,
    port:9200,
    endpoint: 'http://localhost:8079/mway/appTest/api'
});
```

## Example

```bash
node example/run.js
open http://localhost:9200/
```
