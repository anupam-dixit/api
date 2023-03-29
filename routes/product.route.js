var express = require('express');
var router = express.Router();
const ProductController=require('../controllers/product.controller');
const {ensureLogin} = require("../middleware/auth");
const {ensureVendor} = require("../middleware/ensureVendor");
const {validation_create_product, validation_update_product} = require("../validation/product.validation");
const path = require("path");
const multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/products');
    },
    filename: function (req, file, cb) {
        var id =Math.floor((Math.random() * 99999) + 11111)+"-" + Date.now() + path.extname(file.originalname);
        cb(null, id);
    }
})
var upload = multer({ storage: storage })
/* GET users listing. */
router.post('/list',[ensureLogin], ProductController.index);
router.post('/create', [ensureLogin,ensureVendor,validation_create_product], ProductController.create);
router.post('/update', [ensureLogin,validation_update_product], ProductController.update);

module.exports = router;
