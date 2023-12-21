var express = require('express');
var router = express.Router();
const Smscontroller=require('../controllers/sms.controller');
const {ensureLogin} = require("../middleware/auth");
const {validation_list_sms, validation_send_otp, validation_send_sms} = require("../validation/sms.validation");

router.get('/',[ensureLogin,validation_list_sms], Smscontroller.index);
router.post('/create/otp',[validation_send_otp], Smscontroller.create);
router.post('/create',[validation_send_sms], Smscontroller.create);
router.post('/verify', Smscontroller.verify);

module.exports = router;
