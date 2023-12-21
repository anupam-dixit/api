var express = require('express');
var router = express.Router();
const OrderController=require('../controllers/order.controller');
const {ensureLogin} = require("../middleware/auth");
const {validation_update_order, validation_create_file_order, validation_list_order} = require("../validation/order.validation");

router.get('/dt/orders-summary',[], OrderController.dtOrdersSummary);
router.post('/create',[ensureLogin], OrderController.create);
router.post('/update',[ensureLogin,validation_update_order], OrderController.update);
// router.delete('/delete/:_id', CartController.remove);
router.post('/list',[ensureLogin,validation_list_order], OrderController.index);
router.post('/orders-summary',[ensureLogin], OrderController.ordersSummary);
router.post('/file-order/create',[ensureLogin,validation_create_file_order], OrderController.fileOrderCreate);
// router.post('/file-order/summary',[ensureLogin], OrderController.fileOrdersSummary);

module.exports = router;
