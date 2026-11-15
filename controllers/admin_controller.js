const { pool } = require('../database/database');

const add_user = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const { name, email, passwd, phone, type } = req.body;
        if (![name, email, passwd, phone, type].every(value => typeof value === 'string' && value.trim())) {
            req.session.adminMessage = {
                type: 'error',
                text: 'Completa todos los campos para agregar el usuario.'
            };
            return res.redirect('/admin?tab=users');
        }

        const results = await conn.query(`
            INSERT INTO users (name, email, passwd, phone, type)
            VALUES (?, ?, ?, ?, ?)
        `, [name, email, passwd, phone, type]);

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

const update_user = async (req, res) => {
    let conn;
    try {
        const { original_email, name, email, phone, type, passwd } = req.body;
        if (![original_email, name, email, phone].every(v => typeof v === 'string' && v.trim())) {
            req.session.adminMessage = { type: 'error', text: 'Completa todos los campos para editar el usuario.' };
            return res.redirect('/admin?tab=users');
        }

        // Only accept known roles; anything else is ignored
        const newType = ['admin', 'user'].includes(type) ? type : null;

        conn = await pool.getConnection();
        let sql = 'UPDATE users SET name = ?, email = ?, phone = ?, type = IF(id = ?, type, COALESCE(?, type))';
        const params = [name, email, phone, req.session.user_id, newType];
        if (typeof passwd === 'string' && passwd.trim()) {
            sql += ', passwd = ?';
            params.push(passwd);
        }
        sql += ' WHERE email = ?';
        params.push(original_email);

        const results = await conn.query(sql, params);
        req.session.adminMessage = results.affectedRows === 0
            ? { type: 'error', text: 'No se encontró el usuario.' }
            : { type: 'success', text: 'Usuario actualizado correctamente.' };
    } catch (err) {
        console.error('Error updating user:', err);
        req.session.adminMessage = {
            type: 'error',
            text: err.code === 'ER_DUP_ENTRY'
                ? 'Ya existe un usuario con ese email.'
                : 'Ocurrió un error al actualizar el usuario.'
        };
    } finally {
        if (conn) conn.release();
    }
    return res.redirect('/admin?tab=users');
};

const delete_user = async (req, res) => {
    let conn;
    try {
        const { email } = req.body;
        if (typeof email !== 'string' || !email.trim()) {
            req.session.adminMessage = { type: 'error', text: 'Usuario no válido.' };
            return res.redirect('/admin?tab=users');
        }

        conn = await pool.getConnection();
        // "id <> ?" stops an admin from deleting their own account
        const results = await conn.query(
            'DELETE FROM users WHERE email = ? AND id <> ?',
            [email, req.session.user_id]
        );
        req.session.adminMessage = results.affectedRows === 0
            ? { type: 'error', text: 'No se pudo eliminar el usuario (o es tu propia cuenta).' }
            : { type: 'success', text: 'Usuario eliminado correctamente.' };
    } catch (err) {
        console.error('Error deleting user:', err);
        req.session.adminMessage = { type: 'error', text: 'Ocurrió un error al eliminar el usuario.' };
    } finally {
        if (conn) conn.release();
    }
    return res.redirect('/admin?tab=users');
};

module.exports = {
    add_user,
    update_user,
    delete_user
};