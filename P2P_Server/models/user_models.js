const db = require('../database/database');
const Sequelize = require('sequelize');

// Define a User Model with the proper attributes and their options 
const User = db.define('user', {
  // attributes
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'userName',
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'password'
    }
  }, {
    tableName: 'users'
  });
  // create a relation to User_role model  
  // User.associate = function(models) {
    // models.User.hasOne(models.AuthToken);
  // }; 
  

  module.exports = User;