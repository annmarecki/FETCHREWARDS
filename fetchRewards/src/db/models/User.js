const Sequelize = require("sequelize");
const db = require("../db");

const SALT_ROUNDS = 5;

const User = db.define("user", {
  payer: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  points: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 0,
    },
  },
});

module.exports = User;
