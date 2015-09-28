var db = require('./database/interface')
var _ = require('underscore');
var router = require('express').Router();

var api = {

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
      });
    },

    post: function(req, res) {
      db.Entry.create({
        emotion: req.body.emotion,
        text: req.body.text
      }).then(function(entry) {
        entry.setUser(User.findOne({
          where: {name: req.params.username}
        }));
        res.status(201).json(entry);
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
        });
    },

    put: function(req, res) {

    },

    delete: function(req, res) {

    }
  }

};

// TODO: make a little less clever
_.each(api, function(route, key) {
  router.route('/' + key)
    .get(route.get)
    .post(route.post);
});

module.exports = router;
