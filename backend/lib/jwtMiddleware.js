const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
  const token = req.cookies['accessToken'];
  console.log('test');
  if (!token) return next();
  console.log('test2');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.user = {
      _id: decoded._id,
      username: decoded.username,
      companyCode: decoded.companyCode,
      userType: decoded.userType,
    };

    return next();
  } catch (e) {
    return next();
  }
};

module.exports = jwtMiddleware;
