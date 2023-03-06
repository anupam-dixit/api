var express = require('express');
var router = express.Router();
const InviteController=require('../controllers/invite.controller');
const {ensureLogin} = require("../middleware/auth");
const {ensureStaff} = require("../middleware/ensureStaff");
const {validation_create_invitation} = require("../validation/invite.validation");

/* GET users listing. */
router.post('/create', [ensureLogin,ensureStaff,validation_create_invitation], InviteController.create);

module.exports = router;
