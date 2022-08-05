const router = require('express').Router();
const Joi = require('joi');
let User = require('../models/user.models');

router.route('/register').post(async (req, res) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().alphanum().required(),
    companyCode: Joi.string().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).json({
      message: result.error.message,
      httpStatus: 400,
    });
    return;
  }

  const { username, password, companyCode } = req.body;

  const user = new User({
    username,
    companyCode,
  });

  try {
    const exists = await User.findByUsername(username);
    if (exists) {
      res.status(409).json({
        message: '아이디가 중복되었습니다.',
        httpStatus: 409,
      });
      return;
    }
    await user.setPassword(password);
    let resultUser = user.serialize();

    const token = user.generateToken();

    res.cookie('accessToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    await user.save();
    res.status(201).send(resultUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.route('/login').post(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(401).json({
      message: '비어 있는 값이 있습니다.',
      httpStatus: 401,
    });
    return;
  }
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      res.status(401).json({
        message: '존재하지 않는 아이디입니다',
        httpStatus: 401,
      });
      return;
    }
    const valid = await user.checkPassword(password);
    if (!valid) {
      res.status(401).json({
        message: '비밀번호가 틀립니다.',
        httpStatus: 401,
      });
      return;
    }
    const result = user.serialize();

    const token = user.generateToken();

    res.cookie('accessToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    console.log(token);
    res.status(200).json(result);
    return;
  } catch (e) {
    res.status(500).json(e);
  }
});

router.route('/check').get((req, res) => {
  const { user } = res;
  if (!user) {
    res.status(401).json({
      message: 'jwt이 없습니다',
      httpStatus: 401,
    });
  }
  res.json({
    user,
    httpStatus: 200,
  });
});

router.route('/logout').post((req, res) => {
  res.cookie('accessToken');
  res.json({
    httpStatus: 204,
  });
});

module.exports = router;

// 0802 working
// https://www.geeksforgeeks.org/login-form-using-node-js-and-mongodb/
