var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
var { v4: uuidv4 } = require('uuid');
var { createHash } = require('node:crypto');

const connectionOptions = {
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'is'
}

function ensureAuth(req, res, next) {
  if(req.session.user) {
    return next();
  }

  return res.sendStatus(401); 
}

router.get('/', ensureAuth, async function(req, res, next) {
  const connection = await mysql.createConnection(connectionOptions);

  const [rows] = await connection.query('SELECT id,name,email FROM users');

  connection.end();

  res.send(rows);
});

router.get("/:id", ensureAuth, async function(req, res, next){
  const connection = await mysql.createConnection(connectionOptions);

  const [rows] = await connection.query(
    'SELECT id,name,email FROM users WHERE id = ?',
    [req.params.id]
  );

  connection.end();

  if(rows.length == 0) {
    res.sendStatus(404);
    return;
  }

  res.send(rows[0]);
});

router.post("/", ensureAuth, async function(req, res, next) {
  const validation = validate(req.body);

  if(!validation.valid) {
    res.status(422).send(validation.errors);
    return;
  }

  const user = {
    id: uuidv4(),
    name: req.body.name,
    email: req.body.email,
    password: encryptPassword(req.body.password)
  };

  const connection = await mysql.createConnection(connectionOptions);

  await connection.query(
    'INSERT INTO users VALUES (?,?,?,?)',
    [user.id, user.name, user.email, user.password]
  );

  connection.end();

  delete user.password;

  res.send(user);
});

router.put("/:id", ensureAuth, async function(req, res, next) {
  const connection = await mysql.createConnection(connectionOptions);

  const [rows] = await connection
    .query(
      `SELECT 
        id
      FROM users 
      WHERE id = ?`, 
      [req.params.id]
    );

  if(rows.length == 0) {
    connection.end();
    res.sendStatus(404);
    return;
  }

  const validation = validate(req.body);

  if(!validation.valid) {
    res.status(422).send(validation.errors);
    return;
  }

  const user = {
    id: req.params.id,
    name: req.body.name,
    email: req.body.email,
    password: encryptPassword(req.body.password)
  };

  await connection
  .query(
    `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`, 
    [user.name, user.email, user.password, user.id]
  );

  connection.end();

  delete user.password;

  res.send(user);
});

router.delete('/:id', ensureAuth, async function(req, res, next) {
  const connection = await mysql.createConnection(connectionOptions);

  const [rows] = await connection
    .query(
      `SELECT 
        id,
        name,
        email
      FROM users 
      WHERE id = ?`, 
      [req.params.id]
    );

  if(rows.length == 0) {
    connection.end();
    res.sendStatus(404);
    return;
  }

  await connection
    .query(
      `DELETE FROM users WHERE id = ?`, 
      [req.params.id]
    );

  connection.end();

  res.send(rows[0]);
});

function validate(data) {
  const validations = [
    {
      field: "name",
      validation: !(data.name == undefined || data.name == null || data.name == ""),
      error: "Name is Required"
    },
    {
      field: "email",
      validation: !(data.email == undefined || data.email == null || data.email == ""),
      error: "Email is Required"
    },
    {
      field: "password",
      validation: !(data.password == undefined || data.password == null || data.password == ""),
      error: "Password is Required"
    }
  ]

  const errors = {}

  validations.filter(item => !item.validation)
    .forEach(item => {

      errors[item.field] = item.error;
    });
  
  return {
    valid: Object.entries(errors).length == 0,
    errors: errors
  };
}

function encryptPassword(password) {
  const hash = createHash('sha512');

  hash.update(password + "lhdkajljldjalkdja");

  return hash.digest('hex');
}

module.exports = router;