const { expressjwt: jwt } = require('express-jwt');

// Middleware to verify JWT token
const authMiddleware = jwt({
  secret: process.env.JWT_SECRET_KEY,
  algorithms: ['HS256'],
  requestProperty: 'user',
});

module.exports = authMiddleware;
