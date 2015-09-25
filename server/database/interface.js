var Sequelize = require('sequelize');

var config = require('./postgres.config.js');
var db = new Sequelize(config.url, {sync: {schema: config.mainSchema}}); // Require in the postgres credentials

var models = require('./models');

var User = db.define('user', models.User.attributes, models.User.options);
User.schema(config.mainSchema);

var Entry = db.define('entry', models.Entry.attributes, models.Entry.options);
Entry.schema(config.mainSchema);

var Prompt = db.define('prompt', models.Prompt.attributes, models.Prompt.options);
Prompt.schema(config.mainSchema);


Entry.belongsTo(User);

var shouldForce = process.env.NODE_ENV === 'development'
  ? true
  : false;

db.sync({force: shouldForce})
  .then(function() {
    if (shouldForce) process.exit(0);
  });



// TODO: Export methods here
module.exports = db;