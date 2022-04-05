//this is the access point for all things database related
const Sequelize = require("sequelize");
const db = require("./db");
const User = require("./models/User");
const Transaction = require("./models/Transaction");

//associations between databases
User.hasMany(Transaction);
Transaction.belongsTo(User);

module.exports = {
  db,
  models: {
    User,
    Transaction,
  },
};
