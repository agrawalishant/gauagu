var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/customers');
var stocksRouter = require('./routes/stocks');
var adminRouter = require('./routes/admin');


var routes = require('./routes');
var user = require('./routes/customers');
var http = require('http');
var bodyParser = require('body-parser');


var app = express();

// view engine setup
app.set('port', process.env.PORT || 3030);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: true  }));
app.use(express.urlencoded({ extended: true  }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'upload/images')));
app.use("/public/upload", express.static(path.join(__dirname, '/public/upload/')));
app.use(cors());
//Implementing cors
 
app.use('/',indexRouter);
app.use('/api/customers',usersRouter);
app.use('/api/stocks',stocksRouter);
app.use('/api/admin',adminRouter);

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
