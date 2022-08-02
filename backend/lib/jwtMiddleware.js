const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  const token = req.cookies["accessToken"];
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.user = {
      _id: decoded._id,
      username: decoded.username,
    };
    return next();
  } catch (e) {
    return next();
  }
};

module.exports = jwtMiddleware;
