var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
var { createHash } = require('node:crypto');

const connectionOptions = {
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'is'
}

router.post('/login', async function (req, res, next) {
    
    const email = req.body.email;

    const password = req.body.password;

    const connection = await mysql.createConnection(connectionOptions);

    const [rows] = await connection.query(
        "SELECT id, name, email, password FROM users WHERE email = ?",
        [email]
    );

    const error = {
        credentials: "Email ou password errados"
    };

    if(rows.length == 0) {
        connection.end();

        res.status(422).send(error);

        return;
    }

    const hash = createHash('sha512');

    hash.update(password + "lhdkajljldjalkdja");

    const hashedPassword = hash.digest('hex');

    if(hashedPassword != rows[0].password) {
        connection.end();

        res.status(422).send(error);

        return;
    }

    req.session.user = rows[0];

    res.send({autenticated: true});
})

module.exports = router;