var db = require('./database/interface');
var router = require('express').Router();

// All of these endpoints will be mounted onto `/api/users`
var pathHandlers = {

  '': {
    post:function(req, res, cb) {
      // Check to see if a user with this name already exists.
      db.User.find( {where: { name: req.body.username }} )
        .then(function(user) {
          // If a user with this name is found, reject the post request.
          if (user) {
            res.status(409).send('User already exists');
          } else {
            // Else, we initiate creating the user and pass the promise out to the chain.
            return db.User.create({ name: req.body.username, password: req.body.password });
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
      db.User.findOne({where: {name: req.params.username}})
        .then(function(user) {
          return user.getEntries()
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
            res.status(404).end();
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
      db.Entry.update(req.body, {where: {id: req.params.entryid}})
        .then(function() {
          res.status(200).end();
        })
        .catch(function(err) {
          console.error(err);
          res.status(400).send(err);
        });
    },

    delete: function(req, res) {
      db.Entry.destroy({where: {id: req.params.entryid}})
        .then(function() {
          res.status(200).end();
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
