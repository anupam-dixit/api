var express = require('express');
var router = express.Router();
const CartController=require('../controllers/cart.controller');
const {validation_create_cart} = require("../validation/cart.validation");

router.post('/create',[validation_create_cart], CartController.create);
// router.post('/update', CartController.update);
// router.delete('/delete/:_id', CartController.remove);
router.post('/list', CartController.list);

module.exports = router;
