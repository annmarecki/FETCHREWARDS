"use strict";
const { db } = require("../src/db");
const {
  models: { User, Transaction },
} = require("../src/db");

const users = [
  {
    payer: "DANNON",
    points: 10000,
  },
  {
    payer: "MILLER COORS",
    points: 500,
  },
  {
    payer: "COMMANDER'S PALACE",
    points: 0,
  },
];

const transactions = [
  {
    userId: 1,
    points: 6000,
    timestamp: "2020-11-02T14:00:00Z",
  },
  {
    userId: 2,
    points: 500,
    timestamp: "2020-10-31T15:00:00Z",
  },
  {
    userId: 1,
    points: 4000,
    timestamp: "2022-03-31T14:00:00Z",
  },
];
const seed = async () => {
  try {
    await db.sync({ force: true });
    await User.bulkCreate(users);
    await Transaction.bulkCreate(transactions);
  } catch (err) {
    console.log(err);
  }
};

module.exports = seed;

if (require.main === module) {
  seed()
    .then(() => {
      console.log("Seeding success!");
      db.close();
    })
    .catch((err) => {
      console.error("Oh noes! Something went wrong!");
      console.error(err);
      db.close();
    });
}
