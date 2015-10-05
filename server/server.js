var path = require('path');

var express = require('express');
// middleware
var morgan = require('morgan');
var parser = require('body-parser');
var jwt = require('jsonwebtoken');

var secret = process.env.TOKEN_SECRET;
var router = require('./routes');
var db = require('./database/interface');

var app = express();

// logging and parsing
app.use(morgan('dev'));
app.use(parser.json());
app.set('secret', secret); //set secret variable (we can come up with a better secret and store it in a different file)

// Mount router for api
app.use('/api/users', router);

var port = process.env.PORT || 8080;

// serve static files
app.use(express.static(path.resolve(__dirname, '..', 'client')));

if (process.env.NODE_ENV === 'test') {
  // If we're launching tests, Mocha will call db.init().
  // We just need to have the server be ready for connections.
  app.listen(port, function(err) {
    if (err) console.error(err);
  });

} else {
  // If we aren't testing, we want to wait until we're synced
  // with the database before we start accepting connections.
  db.init().then(function() {

    app.listen(port, function(err) {
      if (err) {
        console.error(err);
      } else {
        console.log('listening on port: ', port);
      }
    });

  });

}

// console.log(router.stack);

module.exports = app;
