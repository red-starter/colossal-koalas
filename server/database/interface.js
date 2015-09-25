var Sequelize = require('sequelize');
var db = new Sequelize(require('./postgres.config.js'), {sync: {schema: 'moodlet'}}); // Require in the postgres credentials
var models = require('./models');

var User = db.define('user', models.User.attributes, models.User.options);
var Entry = db.define('entry', models.Entry.attributes, models.Entry.options);
var Prompt = db.define('prompt', models.Prompt.attributes, models.Prompt.options);

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