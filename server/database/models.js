var Sequelize = require('sequelize');
var orm = new Sequelize('greenfeels', 'root', ''); // db name, username, pw

var User = orm.define('User', {
	username: Sequelize.STRING,
	password: Sequelize.STRING
});

var Post = orm.define('Post', {
	body: Sequelize.STRING
});

var Feel = orm.define('Feel', {
	emotion: Sequelize.STRING
});

// foreign key constraints

// Post.belongsTo(User);
// User.hasMany(Post);

// Feel.belongsTo(User);
// User.hasMany(Feel);

// Feel.belongsTo(Post);
// Post.hasOne(Feel);

// create tables
User.sync();
Post.sync();
Feel.sync();

exports.User = User;
exports.Post = Post;
exports.Feel = Feel;
