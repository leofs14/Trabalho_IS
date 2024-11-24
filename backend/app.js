var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var usersRouter = require('./routes/users');
var loginRouter = require('./routes/auth');

var app = express();

app.use(session({
    secret: 'FdzvG2o9cXl42OYocqurNNonhObVfaIf',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Authorization,X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/auth', loginRouter);

module.exports = app;