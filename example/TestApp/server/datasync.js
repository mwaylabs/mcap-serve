var express = require('mcap/express.js');
var bikini = require('mcap/bikini.js');
var app = express();
app.use(express.bodyParser());

app.get('/', function (req, res) {
    res.send(app.routes);
});

app.use('/Todo', bikini.middleware({
    entity: '',
    type: {
        container: '',
        model: ''
    },
    idAttribute: '_id'
}));

//datasync-modules

module.exports = app;
