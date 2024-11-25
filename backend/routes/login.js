const { createHash } = require("crypto");
// Importa a função `createHash` do módulo `crypto` para usar algoritmos de hash (no caso, SHA-512).

var express = require("express");
var router = express.Router();
// Importa o framework Express para gerenciar rotas HTTP e cria um roteador para lidar com as rotas relacionadas.

const mysql = require("mysql2");
// Importa o módulo MySQLi para conexão e manipulação do banco de dados MySQL.

const dbConfig = {
  host: "localhost", // Endereço do servidor MySQL
  user: "root", // Nome de usuário do banco de dados
  password: "root123", // Senha do banco de dados
  database: "Filmes", // Nome do banco de dados
};

const connection = mysql.createConnection(dbConfig);
// Cria uma conexão com o banco de dados MySQL usando as configurações fornecidas.

connection.connect(function (err) {
  // Conecta ao banco de dados MySQL.
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
  } else {
    console.log("Conectado ao MySQL!");
  }
});

router.post("/", async function (req, res, next) {
  // Define uma rota POST na raiz ("/") que será usada para autenticação de usuários.
  const { email, password } = req.body;
  // Extrai `email` e `password` do corpo da requisição.

  const hash = createHash("sha512");
  // Cria uma instância do hash usando o algoritmo SHA-512.

  hash.update(password);
  // Alimenta o hash com a senha recebida.

  const hashedPassword = hash.digest("hex");
  // Gera o hash final no formato hexadecimal.

  console.log(hashedPassword);
  // Loga o hash da senha para depuração (não recomendado em produção, pois expõe dados sensíveis).

  const query = "SELECT * FROM users WHERE email = ?";
  // Consulta SQL para procurar o usuário no banco de dados.

  connection.query(query, [email], function (err, results) {
    if (err) {
      // Se houver erro na consulta:
      console.error("Erro ao buscar usuário no MySQL:", err);
      return res.status(500).json({ message: "Erro no servidor" });
      // Retorna um erro 500 (erro interno do servidor).
    }

    if (results.length === 0 || hashedPassword !== results[0].password) {
      // Verifica se o usuário não foi encontrado ou se a senha não corresponde:
      return res.status(401).json({ message: "Credenciais inválidas." });
      // Retorna um erro 401 (não autorizado) com uma mensagem indicando credenciais inválidas.
    }

    req.session.user = results[0];
    // Se as credenciais forem válidas, armazena o usuário na sessão para controle posterior.

    res.send({ autenticated: true });
    // Responde com uma mensagem de autenticação bem-sucedida.
  });
});

module.exports = router;
// Exporta o roteador para que possa ser usado em outros arquivos do projeto.