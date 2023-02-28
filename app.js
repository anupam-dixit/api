'use strict'
var createError = require('http-errors');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var logger = require('morgan');
var express = require('express');
var cors = require('cors');
const {db_con} = require("./db_con");


var app = module.exports = express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(cors());

app.use(bodyParser.json());
app.use(multer().array());
app.use(bodyParser.urlencoded({ extended: true }));
/*
database
 */
console.log(db_con)
/*
database
 */

var indexRouter = require('./routes/index.routes');
var usersRouter = require('./routes/user.routes');
var filesRouter = require('./routes/file.routes');
var smsRouter = require('./routes/sms.routes');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/files', filesRouter);
app.use('/sms', smsRouter);

/* istanbul ignore next */
if (!module.parent) {
  app.listen();
  console.log('🔥 Express started on port 3000');
}
