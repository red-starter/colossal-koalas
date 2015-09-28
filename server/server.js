var express = require('express');
// middleware
var morgan = require('morgan');
var parser = require('body-parser');
var router = require('./routes');

var app = express();

// logging and parsing
app.use(morgan('dev'));
app.use(parser.json());
app.use('/api/users', router);

var port = process.env.PORT || 8080;

// serve static files

// set up routes
// TODO: actually serve client stuff
app.get('/', function(req, res) {
	res.send('<p>hello</p>');
});

app.listen(port, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('listening on port: ', port); 
  }
});

console.log(router.stack);

module.exports = app;
