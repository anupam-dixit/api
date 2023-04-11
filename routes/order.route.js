var express = require('express');
var router = express.Router();
const OrderController=require('../controllers/order.controller');
const {ensureLogin} = require("../middleware/auth");

router.post('/create',[ensureLogin], OrderController.create);
// router.post('/update', CartController.update);
// router.delete('/delete/:_id', CartController.remove);
router.post('/list',[ensureLogin], OrderController.index);

module.exports = router;
