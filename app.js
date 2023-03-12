'use strict'
var createError = require('http-errors');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var logger = require('morgan');
var express = require('express');
var cors = require('cors');
const {db_con} = require("./db_con");
require('dotenv').config();


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
var inviteRouter = require('./routes/invite.route');
var domainRouter = require('./routes/domain.route');
var categoryRouter = require('./routes/category.route');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/files', filesRouter);
app.use('/sms', smsRouter);
app.use('/invite', inviteRouter);
app.use('/domain', domainRouter);
app.use('/category', categoryRouter);

app.listen(process.env.HOST_PORT||3000, () => {
  console.log(`>>>>>> Running <<<<<<`)
})
