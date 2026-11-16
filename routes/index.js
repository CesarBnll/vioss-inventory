const express = require('express');
const login_controller = require('../controllers/login_controller');
const router = express.Router();

router.get('/', function (req, res) {
    res.redirect('/login');
});

/* ---------------- Login page ---------------- */
router.get('/login', function (req, res, next) {
    let options = {
        title: "Iniciar Sesión",
        message: ""
    };
    if (req.query.redirect) {
        options["message"] = "auth";
    } else if (req.query.recovery) {
        options["message"] = "success";
    }
    return res.render('login', options);
});
router.post('/login', login_controller.auth);

/* ---------------- Recovery page ---------------- */
router.get('/login/recovery', function (req, res, next) {
    return res.render('recovery', { title: 'Reestablecer Contraseña', message: '' });
});
router.post('/login/recovery', login_controller.recovery);

module.exports = router;