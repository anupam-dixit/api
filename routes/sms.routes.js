var express = require('express');
var router = express.Router();
const Smscontroller=require('../controllers/sms.controller');

router.get('/', Smscontroller.index);
router.post('/create', Smscontroller.create);
router.post('/verify', Smscontroller.verify);

module.exports = router;
