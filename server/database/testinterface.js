var Sequelize = require('sequelize');

var config = require('./postgres.config.js');
var db = new Sequelize(config.url, {sync: {schema: config.testSchema}}); // Require in the postgres credentials

var models = require('./models');

var User = db.define('user', models.User.attributes, models.User.options);
User.schema(config.testSchema);

var Entry = db.define('entry', models.Entry.attributes, models.Entry.options);
Entry.schema(config.testSchema);

var Prompt = db.define('prompt', models.Prompt.attributes, models.Prompt.options);
Prompt.schema(config.testSchema);

Entry.belongsTo(User);

db.sync({force: true}).then(function() { process.exit(0); });

// TODO: Export methods here
module.exports = db;