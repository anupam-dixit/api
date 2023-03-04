var express = require('express');
var router = express.Router();
const UserController=require('../controllers/user.controller');
const {ensureLogin} = require("../middleware/auth");
const {ensureAdmin} = require("../middleware/ensureAdmin");
const {validation_create_user} = require("../validation/user.validation");

/* GET users listing. */
router.get('/',[ensureLogin], UserController.index);
router.post('/signup', UserController.signup);
router.post('/create', [ensureLogin,ensureAdmin,validation_create_user], UserController.create);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/demo', UserController.demo);

module.exports = router;
