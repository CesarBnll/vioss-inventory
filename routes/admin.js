const express = require('express');
const router = express.Router();
const { pool } = require('../database/database');
const { requireAdmin } = require('../middleware/auth');
const admin_controller = require('../controllers/admin_controller');
const login_controller = require('../controllers/login_controller');

const TABS = ['inventory', 'users', 'history', 'actions'];

// Every route in this router requires an admin, except logout
router.post('/logout', login_controller.logout);
router.use(requireAdmin);

router.get('/', async function (req, res, next) {
  let conn;
  try {
    conn = await pool.getConnection();
    const users = await conn.query('SELECT id, name, email, phone, type FROM users');
    const history = await conn.query('SELECT * FROM history ORDER BY date_of DESC');
    const message = req.session.adminMessage || null;
    delete req.session.adminMessage;

    return res.render('admin', {
      title: 'Vioss Administrativo',
      activeTab: TABS.includes(req.query.tab) ? req.query.tab : 'inventory',
      message,
      users,
      history,
      currentUserId: req.session.user_id
    });
  } catch (err) {
    next(err);
  } finally {
    if (conn) conn.release();
  }
});

router.post('/add_user', admin_controller.add_user);
router.post('/update_user', admin_controller.update_user);
router.post('/delete_user', admin_controller.delete_user);

module.exports = router;