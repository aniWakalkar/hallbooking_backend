const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).send({ message: 'Access denied. Admins only.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Invalid token' });
  }
};

module.exports = verifyAdmin;
