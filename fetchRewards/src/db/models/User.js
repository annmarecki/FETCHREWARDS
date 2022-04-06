const Sequelize = require("sequelize");
const db = require("../db");

//defining the postgresql model for the user

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
