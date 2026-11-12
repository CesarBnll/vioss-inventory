const { pool } = require('../database/database');

const add_user = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const { name, email, pass, phone, type } = req.body;
        if (![name, email, pass, phone, type].every(value => typeof value === 'string' && value.trim())) {
            req.session.adminMessage = {
                type: 'error',
                text: 'Completa todos los campos para agregar el usuario.'
            };
            return res.redirect('/admin?tab=users');
        }

        const results = await conn.query(`
            INSERT INTO users (name, email, passwd, phone, type)
            VALUES (?, ?, ?, ?, ?)
        `, [name, email, pass, phone, type]);

        if (results.affectedRows === 0) {
            req.session.adminMessage = {
                type: 'error',
                text: 'No se pudo agregar el usuario. Inténtalo de nuevo.'
            };
            return res.redirect('/admin?tab=users');
        }

        req.session.adminMessage = {
            type: 'success',
            text: 'Usuario agregado correctamente.'
        };
        return res.redirect('/admin?tab=users');
    } catch (err) {
        console.error('Error adding admin user:', err);
        req.session.adminMessage = {
            type: 'error',
            text: 'Ocurrió un error al agregar el usuario. Inténtalo de nuevo.'
        };
        return res.redirect('/admin?tab=users');
    } finally {
        if (conn) {
            conn.release();
        }
    }
};

module.exports = {
    add_user
};