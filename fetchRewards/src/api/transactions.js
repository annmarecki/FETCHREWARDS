const router = require("express").Router();
const {
  models: { Transaction, User },
} = require("../db");

module.exports = router;

//GET: all users to api/transactions/
router.get("/", async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      attributes: ["points", "transactionType"],
      include: {
        model: User,
        attributes: ["payer"],
      },
    });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

//additional route I added that was not specified on takehome:
//GET: specific user to api/users/:userId
router.get("/:transactionId", async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.transactionId },
      attributes: ["points", "transactionType"],
    });
    if (!transaction) {
      res.status(404).send("Sorry this transaction does not exist!");
    } else {
      res.json(transaction);
    }
  } catch (err) {
    next(err);
  }
});

//POST: add a transaction at api/transactions using inputted values in the body
// front end will send payer name, type, and amount of points, date
router.post("/pay", async (req, res, next) => {
  try {
    if (req.body.transactionType === "pay") {
      let transaction = await Transaction.create(req.body);
      let transactionPayer = await User.findOne({
        where: { payer: req.body.payer },
      });
      await transactionPayer.increment("points", {
        by: transaction.points,
      });
      res.json(transaction);
    } else {
      res.send("Sorry the transaction type is not pay!");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/spend", async (req, res, next) => {
  try {
    if (req.body.transactionType === "spend") {
      let transaction = await Transaction.create(req.body);
      let transactionPoints = req.body.points;
      let payers = await User.findAll({ order: [["timestamp", "DESC"]] });
      let transactionPayers = [];
      for (let i = 0; i < payers.length; i++) {
        let oldest = payers[i];
        if (transactionPoints > 0) {
          if (transactionPoints > oldest.points) {
            transactionPoints -= oldest.points;
            let decrementUser = await User.findOne({
              where: { id: oldest.id },
            });
            decrementUser.decrement("points", { by: oldest.points });
            transactionPayers.push({
              payer: oldest.payer,
              points: `-${oldest.points}`,
            });
          } else {
            oldest.points -= transactionPoints;
            let decrementUser = await User.findOne({
              where: { id: oldest.id },
            });
            decrementUser.decrement("points", { by: transactionPoints });
            transactionPayers.push({
              payer: oldest.payer,
              points: `-${transactionPoints}`,
            });
            transactionPoints = 0;
          }
        }
        res.send(transactionPayers);
      }
    } else {
      res.send("Sorry the transaction type is not spend!");
    }
  } catch (error) {
    next(error);
  }
});
