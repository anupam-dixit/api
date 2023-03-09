var express = require('express');
var router = express.Router();
const InviteController=require('../controllers/invite.controller');
const {ensureLogin} = require("../middleware/auth");
const {ensureStaff} = require("../middleware/ensureStaff");
const {validation_create_invitation, validation_accept_invitation} = require("../validation/invite.validation");

/* GET users listing. */
router.post('/create', [ensureLogin,ensureStaff,validation_create_invitation], InviteController.create);
router.post('/accept', [validation_accept_invitation], InviteController.accept);
router.post('/list', [ensureLogin,ensureStaff], InviteController.list);
router.post('/verify', InviteController.verify);

module.exports = router;
