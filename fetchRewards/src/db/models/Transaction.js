const Sequelize = require("sequelize");
const db = require("../db");

const SALT_ROUNDS = 5;

const Transaction = db.define("Transaction", {
  points: {
    type: Sequelize.INTEGER,
  },
  timestamp: {
    type: Sequelize.DATE,
  },
});

module.exports = Transaction;
