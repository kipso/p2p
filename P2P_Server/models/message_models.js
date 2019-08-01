const db = require('../database/database');
const Sequelize = require('sequelize');
// const User = require('./user_models');

// Define a User_role Model with the proper attributes and their options 
const Message = db.define('messages', {
  // attributes
  message: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'message'
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'senderId'
  },
  receiverId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'receiverId'
    },
  timestamp: {
    type: Sequelize.DATE,
    allowNull:false,
    field:'timestamp'
    }
  }, {
    tableName: 'messages'
  });

module.exports = Message;