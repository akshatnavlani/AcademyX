const { expressjwt: jwt } = require('express-jwt'); // Correct way to import the express-jwt package

// Middleware to verify JWT token
const authMiddleware = jwt({
  secret: process.env.JWT_SECRET_KEY,  // Secret key from .env
  algorithms: ['HS256'],  // Algorithm used for JWT
  requestProperty: 'user',  // Attach decoded JWT to the 'user' property on the request object
});

module.exports = authMiddleware;
