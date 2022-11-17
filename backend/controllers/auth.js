import User from '../models/user.models.js';
import Joi from 'joi';

const topCompanyCodes = ['0000', '2000', '4000', '6000', '8000'];

// 회원가입 로직
export const register = async (req, res) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().alphanum().required(),
    companyCode: Joi.string().required(),
    realName: Joi.string().required(),
    userType: Joi.string(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).json({
      message: result.error.message,
      httpStatus: 400,
    });
    return;
  }
  let userType;
  const { username, password, companyCode, realName } = req.body;
  if (topCompanyCodes.includes(companyCode)) userType = 'top'; // code (2000, 4000 ... ) 일때만 권한 top, 그 이외 user
  if (username === 'admin') userType = 'admin'; // username -> admin만 권한 admin

  const user = new User({
    username,
    companyCode,
    realName,
    userType,
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
};

// 로그인 로직
export const login = async (req, res) => {
  const { username, password } = req.body;

  // 아이디, 패스워드 중 빈값이 존재할 때
  if (!username || !password) {
    res.status(401).json({
      message: '비어 있는 값이 있습니다.',
      httpStatus: 401,
    });
    return;
  }

  try {
    const user = await User.findByUsername(username);

    // DB에 해당하는 아이디가 없을 때
    if (!user) {
      res.status(401).json({
        message: '존재하지 않는 아이디입니다',
        httpStatus: 401,
      });
      return;
    }

    // 패스워드가 틀릴 때
    const valid = await user.checkPassword(password);
    if (!valid) {
      res.status(401).json({
        message: '비밀번호가 틀립니다.',
        httpStatus: 401,
      });
      return;
    }

    // 패스워드 제거 후 전송
    const result = user.serialize();

    // token 생성
    const token = user.generateToken();

    // cookie에 토큰 생성
    res.cookie('accessToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    // 로그인 성공 리턴
    res.status(200).json(result);
    return;
  } catch (e) {
    res.status(500).json(e);
  }
};

// 토큰 반환 로직
export const check = async (req, res) => {
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
};

// 로그아웃 로직
export const logout = async (req, res) => {
  res.cookie('accessToken');
  res.json({
    httpStatus: 204,
  });
};
