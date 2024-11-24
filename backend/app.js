var express = require('express');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var pokemonRouter = require('./routes/movies');

const app = express();

// Configuração de sessão
app.use(session({
    secret: 'FdzvG2o9cXl42OYocqurNNonhObVfaIf',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Configuração simples permitindo todas as origens (não recomendada em produção)
// Defina a origem exata que será permitida para as requisições com credenciais
const corsOptions = {
    origin: 'http://localhost:5500',  // Substitua pela origem do seu frontend
    credentials: true,  // Permitir o envio de credenciais (cookies, tokens, etc.)
  };
  
  app.use(cors(corsOptions));
  
  // Outras rotas e middlewares
  app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
  });
  
  app.listen(5000, () => {
    console.log('Servidor rodando na porta 5000');
  });

// Outros middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rotas
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/movies', pokemonRouter);

module.exports = app;

