var express = require('express');
var multer = require('multer');
var router = express.Router();
const UserController=require('../controllers/user.controller');
const {ensureLogin} = require("../middleware/auth");
const {ensurePermission} = require("../middleware/ensurePermission");
const {validation_create_user, validation_update_user,validation_list_user, validation_list_vendors} = require("../validation/user.validation");

/* GET users listing. */
router.post('/',[ensureLogin,validation_list_user], UserController.index);
router.post('/vendors',[validation_list_vendors], UserController.vendors);
router.post('/signup', UserController.signup);
router.post('/create', [ensureLogin,validation_create_user], UserController.create);
router.post('/update', [ensureLogin,validation_update_user], UserController.update);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

module.exports = router;
