var express = require('express');
var router = express.Router();
const InviteController=require('../controllers/invite.controller');
const {ensureLogin} = require("../middleware/auth");
const {ensureStaff} = require("../middleware/ensureStaff");
const {validation_create_invitation, validation_accept_invitation} = require("../validation/invite.validation");
const {ensurePermission} = require("../middleware/ensurePermission");

/* GET users listing. */
router.post('/create', [ensureLogin,ensurePermission('INVITE_CREATE'),validation_create_invitation], InviteController.create);
router.post('/accept', [validation_accept_invitation], InviteController.accept);
router.post('/list', [ensureLogin], InviteController.list);
router.post('/verify', InviteController.verify);

module.exports = router;
