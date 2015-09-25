var Sequelize = require('sequelize');


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

  options: {}

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
