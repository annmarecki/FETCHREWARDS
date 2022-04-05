//this is the access point for all things database related
const Sequelize = require("sequelize");
const db = require("./db");
const User = require("./db/models/User");
const Transactions = require("./db/models/Transactions");

//associations between databases

module.exports = {
  db,
  models: {
    User,
    Transactions,
  },
};
