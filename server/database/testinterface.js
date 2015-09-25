var Sequelize = require('sequelize');
var db = new Sequelize(require('./postgres.config.js'), {sync: {schema: 'moodlet-test'}}); // Require in the postgres credentials
var models = require('./models');

var User = db.define('user', models.User.attributes);
var Entry = db.define('entry', models.Entry.attributes, {name: {singular: 'entry', plural: 'entries'}});
var Prompt = db.define('prompt', models.Prompt.attributes);

Entry.belongsTo(User);

db.sync({force: true})

// TODO: Export methods here
module.exports = db;