const { pool } = require('../database/database');

const add_user = async (req, res) => {
    try {
        const { email, pass, phone, type } = req.body;
        let options = {
            title: 'Vioss Administrativo'
        }
        if (email == "" || pass == "" || phone == "" || type == "") {
            options['message'] = "missing";
            return res.status(400).render('./admin', options);
        }

        let [results] = await pool.query(`
            INSERT INTO users (email, passwd, phone, type)
            VALUES ('${email}', '${pass}', '${phone}', '${type}')
        `);

        if (results.affectedRows == 0) {
            options['message'] = "false";
            return res.status(400).render('./admin', options);
        }
        
        return res.status(200).refresh('./admin');
    } catch(err) {
        return res.status(500).render(err.message);
    }
};