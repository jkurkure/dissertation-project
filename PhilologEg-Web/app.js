var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileupload = require("express-fileupload");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var booksRouter = require('./routes/books');
var kingsRouter = require('./routes/kings');
var museumsRouter = require('./routes/museums');
var corpusRouter = require('./routes/corpus');
var corpusIndexRouter = require('./routes/corpus-index');

var textRouter = require('./routes/texts');
var resDecoder = require('./routes/resDecoder');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/home", homeRouter);
app.use("/books", booksRouter);
app.use("/kings", kingsRouter);
app.use("/museums", museumsRouter);
app.use("/corpus", corpusRouter);
app.use("/default-corpus", corpusIndexRouter);

app.use("/texts", textRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
