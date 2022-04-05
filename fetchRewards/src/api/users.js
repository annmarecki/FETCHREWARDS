const router = require("express").Router();
const {
  models: { User },
} = require("../db");

module.exports = router;

//GET: all users to api/users/
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ["payer", "points"],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

//additional route I added that was not specified on takehome
//GET: specific user to api/users/:userId
router.get("/:userId", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
      attributes: ["payer", "points"],
    });
    if (!user) {
      res.status(404).send("Sorry this user does not exist!");
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
});
