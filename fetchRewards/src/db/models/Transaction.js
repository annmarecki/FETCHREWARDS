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
  type: {
    type: Sequelize.ENUM,
    values: ["pay", "spend"],
  },
});

module.exports = Transaction;
