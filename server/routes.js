// TODO: use interface here instead of requiring models directly
var models = require('./database/models');
var _ = require('underscore');
var router = require('express').Router();

var api = {
  users: {
    get: function(req, res) {
      models.User.findAll().then(function(users) {
        res.json(users);
      })
    },
    post: function(req, res,cb) {
      console.log('request', req);
      models.User.findOrCreate({
        where: {name: req.body.username}
      }).then(function(user) {
        models.User.create({
          name: req.body.username,
          password: req.body.password
        })
      }).then(function(user) {
        console.log('User created: ', user);
        res.sendStatus(201);
      })
    }
  },
  prompts: {
    get: function(req, res) {
      models.Prompt.findAll().then(function(posts) {
        res.json(posts);
      })
    },

    post: function(req, res) {
      models.Prompt.create({
        text: req.body.text
      }).then(function(prompt) {
        console.log('Prompt created: ', prompt);
        res.sendStatus(201);
      })
    }
  },
  entries: {
    get: function(req, res) {
      models.Entry.findAll().then(function(entries) {
        res.json(entries);
      })
    },

    post: function(req, res) {
      models.Entry.create({
        emotion: req.body.emotion,
        text: req.body.text
      }).then(function(entry) {
        console.log('Entry created: ', entry);
        res.sendStatus(201);
      });
    }
  }
};
_.each(api, function(route, key) {
  router.route('/' + key)
  .get(route.get)
  .post(route.post);
});

module.exports = router;




