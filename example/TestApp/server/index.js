var express = require('mcap/express.js');
var app = express();
var dataSync = require('./datasync');

app.use(express.bodyParser());

/**
 * lists all available API.
 */
app.get('/', function( req, res ) {
    res.format({
        json: function() {
            res.send(app.routes);
        }
    });
});

app.use('/dataSync', dataSync);

//starts express webserver
app.listen();
