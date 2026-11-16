const requireUser = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect('/login?redirect=true&user=false');
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.user_id || req.session.user_type !== 'admin') {
    return res.redirect('/login?redirect=true&admin=false');
  }
  next();
};

module.exports = { requireUser, requireAdmin };