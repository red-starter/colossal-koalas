var db = require('./database/interface')
var _ = require('underscore');
var router = require('express').Router();

var endpoints = {

  '/': {

    /* Potentially unneeded
    get: function(req, res) {
      db.User.findAll().then(function(users) {
        res.json(users);
      });
    },
    */

    post: function(req, res, cb) {
      // Check to see if a user with this name already exists.
      db.User.find( {where: { name: req.body.username }} )
        .then(function(user) {
          // If a user with this name is found, reject the post request.
          if (user) {
            res.status(409).send('User already exists');
          } else {
            // Else, we initiate creating the user and pass the promise out to the chain.
            return db.User.create({ name: req.body.username, password: req.body.password })
          }
        })
        .then(function(user) {
          // The next branch of the chain will fulfill with the user.
          // We just send a 201.
          res.status(201).end();
        })
        .catch(function(err) {
          console.error(err);
          res.status(500).end();     
        });
    }
  },

  '/:username/entries': {

    get: function(req, res) {
      db.Entry.findAll({

        include: [{
          model: 'User', 
          as: 'users'
        }],

        where: {
          'users.name': req.params.username
        },

        order: [['createdAt', 'DESC']]
        
      })
      .then(function(entries) {
        res.json(entries);
      })
      .catch(function(err) {
          console.error(err);
          res.status(500).end();     
      });
    },

    post: function(req, res) {
      db.User.findOne({ where: { name: req.params.username } })
        .then(function(user) {
          if (!user) {
            res.status(404).end();
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
          res.status(500).end();     
        });
    }
  },

  '/:username/entries/:entryid': {

    get: function(req, res) {
      db.Entry.findOne({ where: { id: req.params.entryid } })
        .then(function(entry) {
          if (!entry) {
            res.status(404).send();
          } else {
            res.json(entry);
          }
        })
        .catch(function(err) {
          console.error(err);
          res.status(500).end();     
        });
    },

    put: function(req, res) {
      // TODO: update a post
    },

    delete: function(req, res) {
      // TODO: delete a post
    }
  }

};

// TODO: make a little less clever
_.each(endpoints, function(handlers, path) {

  var endpoint = router.route(path);

  for (var method in handlers) {
    endpoint[method] = handlers[method];
  }

});

module.exports = router;
