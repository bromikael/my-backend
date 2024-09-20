// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, 'jwtSecret'); // 'jwtSecret' should be stored in your .env
    req.user = decoded.userId; // Attach user to request object
    next(); // Continue to the next middleware
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
