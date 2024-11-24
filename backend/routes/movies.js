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

// Função para adicionar Pokémon aos favoritos
async function addFavorite(userId, pokemonId, pokemonName) {
  const connection = await mysql.createConnection(connectionOptions);

  try {
    const query = `
      INSERT INTO favorito (user_id, pokemon_id, pokemon_name)
      VALUES (?, ?, ?)
    `;
    await connection.execute(query, [userId, pokemonId, pokemonName]);
  } catch (error) {
    console.error('Erro ao adicionar Pokémon aos favoritos:', error);
  } finally {
    await connection.end();
  }
}

// Rota POST para adicionar Pokémon aos favoritos
router.post('/pokemon_id/favorito', async (req, res) => {
  const { userId, pokemonId, pokemonName } = req.body;

  if (!userId || !pokemonId || !pokemonName) {
    return res.status(400).json({ message: 'Faltando dados obrigatórios!' });
  }

  await addFavorite(userId, pokemonId, pokemonName);

  res.status(200).json({ message: 'Pokémon adicionado aos favoritos!' });
});
router.get('/:pokemon_id/favorito', ensureAuth, async function(req, res, next) {
  const connection = await mysql.createConnection(connectionOptions);

  // Buscar Pokémons favoritos do usuário
  const [rows] = await connection.query(
      'SELECT pokemon_id, pokemon_name FROM favorites WHERE user_id = ?',
      [req.session.user.id]
  );

  connection.end();

  res.send(rows);
});

module.exports = router;