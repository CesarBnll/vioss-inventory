const express = require('express');
const login_controller = require('../controllers/login_controller');
const admin_controller = require('../controllers/admin_controller');
const user_controller = require('../controllers/user_controller');
const router = express.Router();

router.get('/', function (req, res) {
    res.redirect('/login');
})

/* ---------------- Login page ---------------- */
router.get('/login', function (req, res, next) {
    let options = {
        title: "Iniciar Sesión",
        message: ""
    }
    if (req.query.redirect) {
        options["message"] = "auth";
    } else if (req.query.recovery) {
        options["message"] = "success";
    }
    return res.render('login', options);
});
router.post('/login', login_controller.auth);

/* ---------------- Recovery page ---------------- */
router.get('/login/recovery', function(req, res, next) {
  return res.render('recovery', { title: 'Reestablecer Contraseña', message: '' });
});
router.post('/login/recovery', login_controller.recovery);

/* ---------------- User page ---------------- */
router.get('/user', function(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect('/login?redirect=true');
  } else {
    let options = {
        title: "Vioss GPS",
        user_type: req.session.user_type
    }
    return res.render('user', options);
  }
});
router.post('/user/logout', login_controller.logout);

/* ---------------- Admin page ---------------- */
router.get('/admin', function(req, res, next) {
  if ((!req.session.user_id) || req.session.user_type != 'admin') {
    return res.redirect('/login?redirect=true&admin=false');
  } else {
    return res.render('admin', { title: "Vioss Administrativo" });
  }
});
router.post('/admin/logout', login_controller.logout);

module.exports = router;
