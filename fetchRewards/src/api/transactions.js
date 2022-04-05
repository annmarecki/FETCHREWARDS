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
      let newTotal = transactionPayer.points + req.body.points;
      transactionPayer.points = newTotal;
      await transactionPayer.save();
      res.send(transaction);
    } else {
      res.send("Sorry the transaction type is not pay!");
    }
  } catch (error) {
    next(error);
  }
});
