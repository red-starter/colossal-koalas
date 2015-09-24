var Sequelize = require('sequelize');
var orm = new Sequelize('greenfeels', 'root', ''); // db name, username, pw

var User = orm.define('User', {
	username: Sequelize.STRING,
	password: Sequelize.STRING
});

var Feel = orm.define('Feel', {
	emotion: Sequelize.INTEGER,
	text: Sequelize.STRING
});

var Prompt = orm.define('Prompt', {
	// id
	text: Sequelize.STRING
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
Feel.sync();
Prompt.sync();

exports.User = User;
exports.Feel = Feel;
exports.Prompt = Prompt;
