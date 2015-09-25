var Sequelize = require('sequelize');
var Bluebird = require('bluebird');
var bcrypt = Bluebird.promisify(require('bcrypt-nodejs'));


// Function for hashing user's password before storage
// Returns a promise that will fulfill to undefined, or reject with error
// This is attached as a hook, so it takes the model as its argument.
function hashPassword(user) {
  return bcrypt.hashAsync(user.password, null, null)
    .then(function(hash) {
      user.password = hash;
    });
}


// Function for comparing a password at login
// Returns a promise that will fulfill with a boolean
// The `this` keyword is used here since this is passed
// to the model definition as an instance method.
function comparePassword(password) {
  return bcrypt.compareAsync(password, this.password);
}

// Third argument to .define() is the options for the model.
// Here, the 'schema' option specifies which schema in our Postgres
// database we want our tables to be created in, since there are multiple.
// By default, they'll be created in a schema called 'public'.
exports.User = {

  attributes: {

    name: {
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

  },

  options: {

    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
    },

    instanceMethods: {
      comparePassword: comparePassword
    }

  }

};

exports.Entry = {

  attributes: {

    emotion: Sequelize.INTEGER,

    text: Sequelize.STRING,

    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }

  },

  options: {

    // To make sure our table names don't cause confusion,
    // we specify the specific irregular plural of 'entry'
    name: {
      singular: 'entry',
      plural: 'entries'
    }

  }

};

exports.Prompt = {

  attributes: {

    text: Sequelize.STRING,

    // Emotion represents the selected emotion that causes the
    // prompt to display. Initial prompts will have -1 as their 'emotion'.
    emotion: Sequelize.INTEGER,

    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }

  },

  options: {}

};
