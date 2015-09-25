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

// THESE BREAK EVERYTHING - need to fix
// Feel.belongsTo(User);
// User.hasMany(Feel);

// create foreign keys for prompt - feel

// create tables
User.sync({force: true}); // force: true clears tables for testing
Feel.sync({force: true});
Prompt.sync({force: true});

exports.User = User;
exports.Feel = Feel;
exports.Prompt = Prompt;
