var Sequelize = require('sequelize');
var orm = new Sequelize('greenfeels', 'root', ''); // db name, username, pw

var User = orm.define('User', {
	username: Sequelize.STRING,
	password: Sequelize.STRING
});

var Entry = orm.define('Entry', {
	emotion: Sequelize.INTEGER,
	text: Sequelize.STRING
});

var Prompt = orm.define('Prompt', {
	// id
	text: Sequelize.STRING
});

// foreign key constraints

// THESE BREAK EVERYTHING - need to fix
// Entry.belongsTo(User);
// User.hasMany(Entry);

// create foreign keys for prompt - Entry

// create tables
User.sync({force: true}); // force: true clears tables for testing
Entry.sync({force: true});
Prompt.sync({force: true});

exports.User = User;
exports.Entry = Entry;
exports.Prompt = Prompt;
