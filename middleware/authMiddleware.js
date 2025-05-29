import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Check for token in the request headers
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user id to the request object for access in the route handler
    req.user = decoded;
    
    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
