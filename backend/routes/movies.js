var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
var { v4: uuidv4 } = require('uuid');
var { createHash } = require('node:crypto');

const connectionOptions = {
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'Filmes'
}

function ensureAuth(req, res, next) {
  if (req.session.user) {
    return next();
  }

  return res.sendStatus(401);
}

router.get('/', ensureAuth, async function (req, res, next) {
  const connection = await mysql.createConnection(connectionOptions);

  const [rows] = await connection.query('SELECT id,name,email FROM users');

  connection.end();

  res.send(rows);
});

router.get("/:id", ensureAuth, async function (req, res, next) {
  const connection = await mysql.createConnection(connectionOptions);

  const [rows] = await connection.query(
    'SELECT id,name,email FROM users WHERE id = ?',
    [req.params.id]
  );

  connection.end();

  if (rows.length == 0) {
    res.sendStatus(404);
    return;
  }

  res.send(rows[0]);
});

module.exports = router;