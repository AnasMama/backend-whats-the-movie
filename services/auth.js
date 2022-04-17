const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const expressJWT = require('express-jwt');

const generateToken = (user) => {
  const { id, login } = user;
  const token = jwt.sign({ id, login }, secret, { expiresIn: "1h" });
  return token;
};

const auth = expressJWT({ secret, algorithms: ['HS256'] });

module.exports = { generateToken, auth };
