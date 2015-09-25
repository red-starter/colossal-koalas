var Sequelize = require('sequelize');
var orm = new Sequelize(require('./postgres.config.js')); // Require in the postgres credentials


// Third argument to .define() is the options for the model.
// Here, the 'schema' option specifies which schema in our Postgres
// database we want our tables to be created in, since there are multiple.
// By default, they'll be created in a schema called 'public'.
var User = orm.define('User', {

	username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },

	password: {
    type: Sequelize.STRING,
    allowNull: false
  },

  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }

}, {schema: 'moodlet'});

var Entry = orm.define('Entry', {

	emotion: Sequelize.INTEGER,

	text: Sequelize.STRING,

  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }

}, {

  schema: 'moodlet',

  // To make sure our table names don't cause confusion,
  // we specify the specific irregular plural of 'entry'
  name: {
    singular: 'entry',
    plural: 'entries'
  }

});

var Prompt = orm.define('Prompt', {

	text: Sequelize.STRING,

  // Emotion represents the selected emotion that causes the
  // prompt to display. Initial prompts will have -1 as their 'emotion'.
  emotion: Sequelize.INTEGER,

  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }

}, {schema: 'moodlet'});

// foreign key constraints

// THESE BREAK EVERYTHING - need to fix
// Entry.belongsTo(User);
// User.hasMany(Entry);

// create foreign keys for prompt - emotion

// create tables
User.sync({force: true}); // force: true clears tables for testing
Entry.sync({force: true});
Prompt.sync({force: true});

exports.User = User;
exports.Entry = Entry;
exports.Prompt = Prompt;
