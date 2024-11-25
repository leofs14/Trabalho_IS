const express = require("express");
const router = express.Router();
// Importa o Express e cria uma instância de roteador para definir rotas relacionadas a "users".

const mysql = require("mysql2");
// Importa o módulo MySQLi para conectar ao banco de dados MySQL.

const { createHash } = require("crypto");
// Importa a função `createHash` para hashear senhas com o algoritmo SHA-512.

const dbConfig = {
  host: "localhost", // Endereço do servidor MySQL
  user: "root", // Nome de usuário do banco de dados
  password: "root123", // Senha do banco de dados
  database: "Filmes", // Nome do banco de dados
};

const connection = mysql.createConnection(dbConfig);
// Cria a conexão com o banco de dados MySQL.

connection.connect(function (err) {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
  } else {
    console.log("Conectado ao MySQL!");
  }
});

// Middleware para garantir que o usuário esteja autenticado
function ensureAuth(req, res, next) {
  if (req.session.user) {
    return next();
  }
  return res.sendStatus(401);
}

// ** ROTA GET - LISTAR TODOS OS USUÁRIOS **
router.get("/", ensureAuth, async function (req, res, next) {
  try {
    connection.query("SELECT * FROM users", function (err, results) {
      if (err) {
        console.error("Erro ao buscar usuários no MySQL:", err);
        return res.status(500).json({ message: "Erro no servidor" });
      }
      if (!results.length) {
        return res.status(404).send("Nenhum usuário encontrado");
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

// ** ROTA GET - BUSCAR USUÁRIO POR ID **
router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    connection.query("SELECT * FROM users WHERE id = ?", [id], function (err, results) {
      if (err) {
        console.error("Erro ao buscar usuário no MySQL:", err);
        return res.status(500).json({ message: "Erro no servidor" });
      }
      if (!results.length) {
        return res.status(404).send("Usuário não encontrado");
      }
      return res.status(200).json(results[0]);
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

// ** ROTA POST - CRIAR NOVO USUÁRIO **
router.post("/", async function (req, res, next) {
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).send("Campos obrigatórios ausentes");
  }

  const hash = createHash("sha512");
  hash.update(password);
  const hashedPassword = hash.digest("hex");

  const user = { name, email, password: hashedPassword };

  try {
    connection.query("SELECT * FROM users WHERE email = ?", [email], function (err, results) {
      if (err) {
        console.error("Erro ao verificar e-mail no MySQL:", err);
        return res.status(500).json({ message: "Erro no servidor" });
      }
      if (results.length) {
        return res.status(400).send("E-mail já cadastrado");
      }

      connection.query("INSERT INTO users SET ?", user, function (err) {
        if (err) {
          console.error("Erro ao inserir usuário no MySQL:", err);
          return res.status(500).json({ message: "Erro no servidor" });
        }
        return res.status(201).send("Usuário criado com sucesso");
      });
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

// ** ROTA DELETE - REMOVER USUÁRIO POR ID **
router.delete("/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    connection.query("DELETE FROM users WHERE id = ?", [id], function (err, results) {
      if (err) {
        console.error("Erro ao excluir usuário no MySQL:", err);
        return res.status(500).json({ message: "Erro no servidor" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json("Usuário não encontrado");
      }
      return res.status(200).json("Usuário excluído com sucesso");
    });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

// ** ROTA PUT - ATUALIZAR USUÁRIO POR ID **
router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const errors = {};
  if (!name) errors.name = "Nome indefinido";
  if (!email) errors.email = "E-mail indefinido";
  if (!password) errors.password = "Senha inválida";

  if (Object.keys(errors).length > 0) {
    return res.status(422).send(errors);
  }

  const hash = createHash("sha512");
  hash.update(password);
  const hashedPassword = hash.digest("hex");

  try {
    connection.query(
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
      [name, email, hashedPassword, id],
      function (err, results) {
        if (err) {
          console.error("Erro ao atualizar usuário no MySQL:", err);
          return res.status(500).json({ message: "Erro no servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).send("Usuário não encontrado ou não modificado");
        }
        return res.status(200).json({ message: "Usuário atualizado com sucesso" });
      }
    );
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

module.exports = router;
// Exporta o roteador para ser usado em outros arquivos.
