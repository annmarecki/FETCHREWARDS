const router = require("express").Router();
const {
  models: { User },
} = require("../db");
module.exports = router;

//GET: all users to api/users/
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

//GET: specific user to api/users/:userId
router.get("/:userId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      res.status(404).send("Sorry this user does not exist!");
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
});
