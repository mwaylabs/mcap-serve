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
