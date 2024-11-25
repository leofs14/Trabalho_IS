var express = require('express');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var moviesRouter = require('./routes/movies');

var app = express();

// Configuração de sessão
app.use(session({
    secret: 'FdzvG2o9cXl42OYocqurNNonhObVfaIf',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.use(cors({ origin: 'http://127.0.0.1:5500' }));

app.post('/auth/register', (req, res) => {
  // Lógica de registro
  res.send('Registro bem-sucedido');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

// Outros middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rotas
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/movies', moviesRouter);

module.exports = app;

