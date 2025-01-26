const admin = require('../lib/firebaseAdmin'); // Import the initialized admin instance

const { getAuth } = require('firebase-admin/auth');

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header
    if (!token) {
      return res.status(401).json({ message: 'Authentication token is missing' });
    }
    // Verify JWT token with Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(token);
    const email = decodedToken.email;
    if (email && !email.includes('admin')) {
      return res.status(403).json({ message: 'Access denied, Admins only' });
    }

    // If authorized, proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

module.exports = adminMiddleware;
