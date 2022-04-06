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

//POST: add a transaction at api/transactions using inputted values in the body
// front end will send payer name, type, and amount of points, date
router.post("/pay", async (req, res, next) => {
  try {
    const transaction = await Transaction.create(req.body);
    const incrementUser = await User.findOne({
      where: { payer: req.body.payer },
    });
    incrementUser.points += req.body.points;
    incrementUser.save();
    res.json(transaction);
  } catch (error) {
    next(error);
  }
});

router.post("/spend", async (req, res, next) => {
  try {
    await Transaction.create(req.body);
    let transactionPoints = req.body.points;
    const payers = await Transaction.findAll({
      order: [["timestamp", "ASC"]],
    });
    let transactionPayers = [];
    for (let i = 0; i < payers.length; i++) {
      let oldest = payers[i];

      if (transactionPoints > 0) {
        if (transactionPoints > oldest.points) {
          transactionPoints -= oldest.points;
          const decrementUser = await User.findByPk(oldest.userId);

          decrementUser.points = 0;
          decrementUser.save();
          transactionPayers.push({
            payer: oldest.payer,
            points: `-${oldest.points}`,
          });
        } else {
          oldest.points -= transactionPoints;
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
  } catch (error) {
    next(error);
  }
});
