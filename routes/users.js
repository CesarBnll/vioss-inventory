const express = require('express');
const router = express.Router();
const { pool } = require('../database/database');
const { requireUser } = require('../middleware/auth');
const user_controller = require('../controllers/user_controller');
const login_controller = require('../controllers/login_controller');

const TABS = ['inventory', 'users', 'history', 'actions'];

router.post('/logout', login_controller.logout);
router.use(requireUser);

router.get('/', async function(req, res, next) {
  let conn;
  try {
    conn = await pool.getConnection();
    const [user] = await conn.query(
      'SELECT id, name, email, phone, type FROM users WHERE id = ?',
      [req.session.user_id]
    );
    const message = req.session.userMessage || null;
    delete req.session.userMessage;

    return res.render('user', { 
      title: 'Vioss GPS',
      activeTab: TABS.includes(req.query.tab) ? req.query.tab : 'inventory',
      user,
      message: message 
    });
  } catch (err) {
    next(err);
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;