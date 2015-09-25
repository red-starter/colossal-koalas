var express = require('express');
var db = require('./database/config');
// middleware
var morgan = require('morgan');
var parser = require('body-parser');
var router = require('./routes');

var app = express();

// logging and parsing
app.use(morgan('dev'));
app.use(parser.json());
app.use('/api', router);

var port = process.env.PORT || 8080;

// serve static files

// set up routes
app.get('/', function(req, res, next) {
	res.send('<p>hello</p>');
	next();
});

app.listen(port, function(req, res) {
	console.log('listening on port: ', port);
});

console.log(router.stack);

module.exports = app;
