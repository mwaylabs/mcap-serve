
var mcapServe = require('..');
var path = require('path');

mcapServe({
    root: path.resolve(__dirname, './mcap-project/client'),
    enableLivereload: true,
    port: 8081,
    open: true,
    endpoint: 'http//mcap.com/mway/MyApp/api'
});
