var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
var { createHash } = require('node:crypto');
var { v4: uuidv4 } = require('uuid');

const connectionOptions = {
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'Filmes'
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

    hash.update(password);

    const hashedPassword = hash.digest('hex');

    if (hashedPassword != rows[0].password) {
        connection.end();

        res.status(422).send(error);

        return;
    }

    req.session.user = rows[0];

    res.send({autenticated: true});
})

router.post("/register", async function(req, res, next) {
    const validation = validate(req.body);
  
    if (!validation.valid) {
      res.status(422).send(validation.errors);
      return;
    }
  
    const user = {
      id: uuidv4(), // Gerando um UUID para o novo usuário
      name: req.body.name,
      email: req.body.email,
      password: encryptPassword(req.body.password) // Criptografando a senha antes de salvar
    };
  
    const connection = await mysql.createConnection(connectionOptions);
  
    // Verifica se o email já está registrado
    const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', [user.email]);
    if (existingUser.length > 0) {
      connection.end();
      res.status(400).send({ error: "Email already in use" }); // Caso o email já exista
      return;
    }
  
    // Inserindo o novo usuário na tabela 'users'
    await connection.query(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
      [user.id, user.name, user.email, user.password]
    );
  
    connection.end();
  
    delete user.password; // Remover a senha antes de enviar a resposta
  
    res.send(user); // Retorna os dados do usuário criado (sem a senha)
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

    hash.update(password);

    return hash.digest('hex');
}

module.exports = router;