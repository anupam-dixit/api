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
var https = require('https')
var fs = require('fs')

var app = module.exports = express()
app.set('trust proxy', true)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors())
app.use(express.static(path.resolve('public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
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
var subCategoryRouter = require('./routes/sub-category.routes');
var productRouter = require('./routes/product.route');
var cartRouter = require('./routes/cart.route');
var orderRouter = require('./routes/order.route');
var subscriptionRouter = require('./routes/subscription.route');
var accessRouter = require('./routes/access.route');
var notificationRouter = require('./routes/notification.route');
var miscRouter = require('./routes/misc.route');

app.use('/', indexRouter);
app.use('/users',[multer().none()], usersRouter);
app.use('/files', filesRouter);
app.use('/sms',[multer().none()], smsRouter);
app.use('/invite',[multer().none()], inviteRouter);
app.use('/domain',[multer().none()], domainRouter);
app.use('/category',[multer().none()], categoryRouter);
app.use('/sub-category',[multer().none()], subCategoryRouter);
app.use('/product',[multer().none()], productRouter);
app.use('/cart',[multer().none()], cartRouter);
app.use('/order',[multer().none()], orderRouter);
app.use('/subscription',[multer().none()], subscriptionRouter);
app.use('/access',[multer().none()], accessRouter);
app.use('/notification',[multer().none()], notificationRouter);
app.use('/misc',[multer().none()], miscRouter);

var options = {
  key: fs.readFileSync('ssl/key.key'),
  cert: fs.readFileSync('ssl/crt.crt')
};
https.createServer(options, app).listen(process.env.HOST_PORT||3000);
// app.listen(process.env.HOST_PORT||3000, () => {
//   console.log(`>>>>>> Running <<<<<<`)
// })
