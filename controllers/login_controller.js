const { pool } = require('../database/database');

const auth = async (req, res) => {
    let conn;
    try {
        const { email, pass } = req.body;
        let options = {
            title: 'Iniciar Sesión'
        }
        if (email == "" || pass == "") {
            options['message'] = "missing";
            return res.status(400).render('./login', options);
        }
        conn = await pool.getConnection();
        let [results] = await conn.query(`
            SELECT id, type
            FROM users
            WHERE email = ? AND passwd = ?
        `, [email, pass]);
        
        if (!results) {
            options['message'] = "false";
            return res.status(400).render('./login', options);
        }
        
        req.session.user_id = results.id;
        req.session.user_type = results.type;
        if (results.type == 'admin') {
            return res.redirect('/admin');
        } else {
            return res.redirect('/users');
        }
    } catch(err) {
        return res.status(500).render(err.message);
    } finally {
        if (conn) conn.release();
    }
};

const recovery = async (req, res) => {
    try {
        const { email, new_pass } = req.body;
        let options = {
            title: 'Iniciar Sesión',
        }
        if ((email || new_pass) == "") {
            options['message'] = 'missing';
            console.log(options);
            return res.status(400).render('./recovery', options);
        }

        let [results] = pool.query(`
            UPDATE users
            SET password = '${new_pass}'
            WHERE email = '${email}'
        `);
        if (results.affectedRows == 0) {
            options['message'] = 'false';
            return res.status(400).render('./recovery', options);
        }
        
        return res.redirect('/login?recovery=true');
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/login');
};

module.exports = { 
    auth,
    logout,
    recovery
}