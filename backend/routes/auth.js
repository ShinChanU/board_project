const router = require("express").Router();
const Joi = require("joi");
let User = require("../models/user.models");

router.route("/register").post(async (req, res) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status = 400;
    res.body = result.error;
    return;
  }

  const { username, password } = req.body;

  try {
    const exists = await User.findByUsername;
    if (exists) {
      res.status(409);
      return;
    }
    const user = new User({
      username,
    });
    console.log(user);
    await user.setPassword(password);
    await user.save();

    const data = user.toJson();
    delete data.password;
    res.send(data);
    return;
  } catch (e) {
    return e;
  }
});

router.route("/login").post((req, res) => {});

router.route("/check").get((req, res) => {});

router.route("/logout").post((req, res) => {});

module.exports = router;

// 0802 working
// https://www.geeksforgeeks.org/login-form-using-node-js-and-mongodb/
