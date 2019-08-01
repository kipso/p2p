const Sequelize = require('sequelize');
const config = require('../config');
// get the database configuration from config file
const database = config.database;
// Create a new sequlize instancec for our db (postgres)
const sequelize = new Sequelize(database.database, database.username, database.password, {
    host: database.host,
    dialect: database.dialect
  });

  // Check the connection to DB and Export it to other modules
  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  module.exports = sequelize;