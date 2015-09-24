var models = require('./models.js');

var controller = {
	users: {
		get: function(req, res) {
			models.User.findAll().then(function(users) {
				res.json(users);
			})
		},

		post: function(req, res) {
			models.User.findOrCreate({ 
				where: {username: req.body.username}
			}).then(function(user) {
				models.User.create({
					username: req.body.username,
					password: req.body.password
				})
			}).then(function(user) {
				console.log('User created: ', user);
				res.sendStatus(201);
			})
		}
	},

	posts: {
		get: function(req, res) {
			models.Post.findAll().then(function(posts) {
				res.json(posts);
			})
		},

		post: function(req, res) {
			models.Post.create({
				body: req.body.body
			}).then(function(post) {
				console.log('Post created: ', post);
				res.sendStatus(201);
			})
		}
	}, 

	feels: {
		get: function(req, res) {
			models.Feel.findAll().then(function(feels) {
				res.json(feels);
			})
		},

		post: function(req, res) {
			models.Feel.create({
				emotion: req.body.emotion
			}).then(function(feel) {
				console.log('Feel created: ', feel);
				res.sendStatus(201);
			})
		}
	}
};

module.exports = controller;