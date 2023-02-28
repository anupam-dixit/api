var express = require('express');
var router = express.Router();
const UserController=require('../controllers/user.controller');

/* GET users listing. */
router.get('/', UserController.index);
router.post('/create', UserController.create);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

module.exports = router;
