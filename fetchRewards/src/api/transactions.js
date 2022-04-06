const router = require("express").Router();
const {
  models: { Transaction, User },
} = require("../db");

module.exports = router;

// GET: all users to api/transactions/
// additional route I added that was not specified on takehome
// response is all the transactions
router.get("/", async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      attributes: ["points", "type"],
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

// additional route I added that was not specified on takehome:
// GET: specific user to api/transactions/:transactionId
// response is a single transaction

router.get("/:transactionId", async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.transactionId },
      attributes: ["points"],
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

// POST: add a transaction at api/transactions/pay using inputted values in the body
// client will send payer name, userId, type, points, timestamp
// response will be the transaction
// this will also update the user database to reflect the new point balances
router.post("/pay", async (req, res, next) => {
  try {
    const incrementUser = await User.findOne({
      where: { payer: req.body.payer },
    });
    if (req.body.type === "pay" && incrementUser) {
      console.log(incrementUser);
      res.send("User doesn't exist, please use existing users");
      const transaction = await Transaction.create(req.body);
      incrementUser.addTransaction(transaction);
      let newPoints = incrementUser.points + req.body.points;
      incrementUser.points = newPoints;
      incrementUser.save();
      res.json(transaction);
    } else {
      !incrementUser && req.body.type !== "pay"
        ? res.send(
            "user doesn't exist, please use existing users AND wrong transaction type"
          )
        : !incrementUser
        ? res.send("user doesn't exist, please use existing users")
        : res.send("wrong type of transaction");
    }
  } catch (error) {
    next(error);
  }
});

// POST: add a transaction at api/transactions/spend using inputted values in the body
// client will send type and amount of points
// response will be an array with the payers and the amount they paid
// this will also update the user database to reflect the new point balances
router.post("/spend", async (req, res, next) => {
  try {
    if (req.body.type === "spend") {
      await Transaction.create(req.body);
      let transactionPoints = req.body.points;

      // retrieves all the transactions from oldest to newest
      const payers = await Transaction.findAll({
        order: [["timestamp", "ASC"]],
      });
      let transactionPayers = [];
      for (let i = 0; i < payers.length; i++) {
        let oldest = payers[i];
        console.log(oldest);
        if (transactionPoints > 0) {
          if (transactionPoints > oldest.points) {
            transactionPoints -= oldest.points;
            //updates user database
            const decrementUser = await User.findByPk(oldest.userId);
            decrementUser.points = 0;
            decrementUser.save();
            transactionPayers.push({
              payer: oldest.payer,
              points: `-${oldest.points}`,
            });
          } else {
            oldest.points -= transactionPoints;
            //updates user database
            const decrementUser = await User.findByPk(oldest.userId);
            let newPoints = decrementUser.points - transactionPoints;
            decrementUser.points = newPoints;
            decrementUser.save();
            transactionPayers.push({
              payer: oldest.payer,
              points: `-${transactionPoints}`,
            });
            transactionPoints = 0;
          }
        }
      }
      res.send(transactionPayers);
    } else {
      res.send("Wrong type of transaction");
    }
  } catch (error) {
    next(error);
  }
});
