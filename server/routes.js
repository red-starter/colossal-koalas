var models = require('./database/models');
var controller = require('./database/controller')
var _ = require('underscore');
var router = require('express').Router();

var api = {
	users: {
		get: function(req, res) {
			controller.users.get(function(err, results) {
				if (err) {
					console.log('Error retrieving users: ', err);
				} else {
					res.json(results);
				}
			});
		}, 
		post: function(req, res) {
			controller.users.post([req.body.username, req.body.password], function(err, results) {
				if (err) {
					console.log('Error creating user: ', err);
				} else {
					res.sendStatus(201);
				}
			});
		}
	},

	posts: {
		get: function(req, res) {
			controller.posts.get(function(err, results) {
				if (err) {
					console.log('Error retrieving posts: ', err);
				} else {
					res.json(results);
				}
			});			
		}, 
		post: function(req, res) {
			controller.posts.post([req.body.body], function(err, results) {
				if (err) {
					console.log('Error creating post: ', err);
				} else {
					res.sendStatus(201);
				}				
			});
		}
	},

	feels: {
		get: function(req, res) {
			controller.feels.get(function(err, results) {
				if (err) {
					console.log('Error retrieving feels: ', err);
				} else {
					res.json(results);
				}
			});			
		}, 
		post: function(req, res) {
			controller.feels.post([req.body.emotion], function(err, results) {
				if (err) {
					console.log('Error creating feel: ', err);
				} else {
					res.sendStatus(201);
				}				
			});
		}
	}
};
apiArr = ['users','posts','feels']
// router.route('/feels')
// 		.get(api['feels'].get)
// 		.post(api['feels'].post);
_.each(apiArr, function(route) {
	router.route('/' + route)
		.get(api[route].get)
		.post(api[route].post);
});

module.exports = router;