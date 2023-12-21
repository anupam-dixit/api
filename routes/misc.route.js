var express = require('express');
var router = express.Router();
const MiscController=require('../controllers/misc.controller');
const {validation_address_list} = require("../validation/misc.validation");

router.post('/address',[validation_address_list], MiscController.getAddressFromCord);
router.get('/visit/create',[], MiscController.createVisit);

module.exports = router;
