const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 
const secretKey = process.env.JWT_SECRET || 'tested';

async function isAuthenticated(req, res, next) {
  const token = req.cookies.token || req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Token not provided' });
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    // Fetch additional user details from the database based on the userId in the token
    try {
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized - User not found' });
      }

      // Attach the user details to the request object for use in route handlers
      req.user = user;
      next();
      //console.log('Decoded Token:', decoded);

    } catch (error) {
      console.error('Error fetching user details:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
}

module.exports = {
  isAuthenticated,
};
