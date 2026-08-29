import jwt from 'jsonwebtoken';

// Verifies the JWT sent by the client and attaches the decoded user to req.user.
// Any route that uses this middleware can trust req.user.id as the real,
// verified identity of whoever is calling — never trust req.body.userId instead.
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      // Fail loudly instead of silently signing/verifying with a guessable fallback secret
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded.id comes from the signed token, so this is safe to trust
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
  }
};