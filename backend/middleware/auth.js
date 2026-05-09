const jwt = require('jsonwebtoken');

const authMw = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ ok: false, msg: 'Token tidak ada' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, email, role }
    next();
  } catch (err) {
    return res.status(403).json({ ok: false, msg: 'Token tidak valid' });
  }
};

const requireAuth = authMw;

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ ok: false, msg: 'Belum login' });
  if (!roles.includes(req.user.role))
    return res.status(403).json({ ok: false, msg: 'Akses ditolak' });
  next();
};

module.exports = authMw;
module.exports.requireAuth = requireAuth;
module.exports.requireRole = requireRole;