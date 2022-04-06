const Sequelize = require("sequelize");
const db = require("../db");

//defining the postgresql model for the transactions

const Transaction = db.define("Transaction", {
  payer: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "spender",
    validate: {
      notEmpty: true,
    },
  },
  points: {
    type: Sequelize.INTEGER,
  },
  timestamp: {
    type: Sequelize.DATE,
  },
  type: {
    type: Sequelize.ENUM("pay", "spend"),
    allowNull: false,
    validate: {
      isIn: {
        args: [["pay", "spend"]],
        msg: "Wrong type",
      },
    },
  },
});

module.exports = Transaction;
