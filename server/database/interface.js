// Main, non-testing database interface.
// This sets up the sequelize instance for interaction
// with the Postgres server using postgres.config.js and
// models.js.
var Sequelize = require('sequelize');

var config = require('./postgres.config.js');
var db = new Sequelize(config.url, {sync: {schema: config.mainSchema}}); // Require in the postgres credentials

var models = require('./models');


// Each model must have the schema attached or Postgres will
// yell at you unhappily, even though you already specified
// the schema on the sequelize instance. There may be more
// options for the sequelize instance that would avoid this.
var User = db.define('user', models.User.attributes, models.User.options);
User.schema(config.mainSchema);

var Entry = db.define('entry', models.Entry.attributes, models.Entry.options);
Entry.schema(config.mainSchema);

var Prompt = db.define('prompt', models.Prompt.attributes, models.Prompt.options);
Prompt.schema(config.mainSchema);

// Only one foreign key association. Untested as of 9/25.
Entry.belongsTo(User);

// If NODE_ENV is set to 'development' when this code executes,
// the sequelize instance will drop the tables before creating
// them anew. Otherwise, the extant tables will be loaded.
var shouldForce = process.env.NODE_ENV === 'development'
  ? true
  : false;

db.sync({force: shouldForce})
  .then(function() {
    // !!DANGER!! This is inflexible. If you
    // ever execute this code with NODE_ENV set to
    // 'development', this module will kill your process.
    // This should probably be changed to use a more
    // specific environmental variable.
    if (shouldForce) process.exit(0);
  });



// TODO: Export methods here
module.exports = {
  db: db,
  User: User,
  Entries: Entries,
  Prompts: Prompts
};