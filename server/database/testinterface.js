// Parallel testing interface, using a separate schema
// in the Postgres database. This allows us to always
// safely assume during testing that we have no data in
// the tables.
var Sequelize = require('sequelize');

var config = require('./postgres.config.js');
var db = new Sequelize(config.url, {sync: {schema: config.testSchema}}); // Require in the postgres credentials

var models = require('./models');

// See ./interface.js for comments about lines 14/17/20.
var User = db.define('user', models.User.attributes, models.User.options);
User.schema(config.testSchema);

var Entry = db.define('entry', models.Entry.attributes, models.Entry.options);
Entry.schema(config.testSchema);

var Prompt = db.define('prompt', models.Prompt.attributes, models.Prompt.options);
Prompt.schema(config.testSchema);

Entry.belongsTo(User);

// Always start with sparkling fresh tables.
db.sync({force: true});

// TODO: Export methods here
module.exports = db;