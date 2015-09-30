var jwt = require('jsonwebtoken');
var secret = require('./secret');

var db = require('./database/interface');
var router = require('express').Router();
var app = require('./server'); //required server so we could have access to the secret set in server.js

// All of these endpoints will be mounted onto `/api/users`
var pathHandlers = {

  // Sign up new user to api/users
  '': {
    post:function(req, res, next) {
      var username = req.body.username;
      var password = req.body.password;
      // Check to see if a user with this name already exists.
      db.User.find( {where: { name: username }} )
        .then(function(user) {
          // If a user with this name is found, reject the post request.
          if (user) {
            res.status(409).end('User already exists');
          } else {
            // Else, we initiate creating the user and pass the promise out to the chain.
            return db.User.create({ name: username, password: password });
          }
        })
        .then(function(user) {
          // The next branch of the chain will fulfill with the user.
          // We create a jwt and store it in token variable with 24 hour expiration date.
          // This token is send back to the client with username as payload.
          var token = jwt.sign(username, secret, {
            expiresInMinutes: 1440 //expires in 24 hours
          });

          res.status(201).json({
            success: true,
            token: token
          });
          
        })
        .catch(function(err) {
          console.error(err);
          res.sendStatus(500);
        });
    }
  },

  '/signin': {
    
    post:function(req, res, next) {
      var username = req.body.username;
      var password = req.body.password;

      db.User.find( {where: { name: username }} )
        .then(function(user) {
          if (!user) {
            next(new Error('User does not exist'));
          } else {
            return user.comparePassword(password)
              .then(function (foundUser) {
                if (foundUser) {
                  // Token is send back to the client with username as payload.
                  var token = jwt.sign(username, secret, {
                    expiresInMinutes: 1440 //expires in 24 hours
                  });
                  res.status(201).json({
                    success: true,
                    token: token
                  });
                } else {
                  return next(new Error('Password doesn\'t match'));
                }
              });
          }
        })
        .catch(function(err) {
          console.error(err);
          res.sendStatus(500);
        });
    }
  },

  '/:username/entries': {

    get: function(req, res) {
      db.User.findOne({where: {name: req.params.username}})
        .then(function(user) {
          return user.getEntries();
        })
        .then(function(entries) {
          res.json(entries);
        })
        .catch(function(err) {
          console.error(err);
          res.sendStatus(500);
        });
    },

    post: function(req, res) {
      db.User.findOne({ where: { name: req.params.username } })
        .then(function(user) {
          if (!user) {
            res.sendStatus(404);
          } else {
            db.Entry.create({
              emotion: req.body.emotion,
              text: req.body.text,
              userId: user.id
            })
            .then(function(entry) {
              res.json(entry);
            });
          }
        })
        .catch(function(err) {
          console.error(err);
          res.sendStatus(500);
        });
    }
  },

  '/:username/entries/:entryid': {

    get: function(req, res) {
      db.Entry.findOne({ where: { id: req.params.entryid } })
        .then(function(entry) {
          if (!entry) {
            res.sendStatus(404);
          } else {
            res.json(entry);
          }
        })
        .catch(function(err) {
          console.error(err);
          res.sendStatus(500);
        });
    },

    put: function(req, res) {
      db.Entry.update(req.body, {where: {id: req.params.entryid}})
        .then(function() {
          res.sendStatus(200);
        })
        .catch(function(err) {
          console.error(err);
          res.status(400).send(err);
        });
    },

    delete: function(req, res) {
      db.Entry.destroy({where: {id: req.params.entryid}})
        .then(function() {
          res.sendStatus(200);
        })
        .catch(function(err) {
          console.error(err);
          res.status(400).send(err);
        })
    }
  }

};

var path, routePath, method;

for (path in pathHandlers) {

  routePath = router.route(path);

  for (method in pathHandlers[path]) {
    routePath[method]( pathHandlers[path][method] );
  }

}


module.exports = router;
