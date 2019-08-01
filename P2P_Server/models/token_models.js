const db = require('../database/database');
const Sequelize = require('sequelize');

// Define a User_role Model with the proper attributes and their options 
const  Token= db.define('tokens', {
    // attributes
    authToken: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'authToken' 
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'userId'
    }
  }, {
    tableName: 'token'
  });

  module.exports = Token;