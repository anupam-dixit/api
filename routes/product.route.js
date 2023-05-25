var express = require('express');
var router = express.Router();
const ProductController=require('../controllers/product.controller');
const {ensureLogin} = require("../middleware/auth");
const {ensureVendor} = require("../middleware/ensureVendor");
const {validation_create_product, validation_update_product, validation_delete_product, validation_list_product,
    validation_toggle_active
} = require("../validation/product.validation");
const path = require("path");
const multer = require("multer");
const {ensureAdmin} = require("../middleware/ensureAdmin");
const {ensurePermission} = require("../middleware/ensurePermission");
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
router.post('/list',[validation_list_product], ProductController.index);
router.post('/create', [ensureLogin,ensurePermission("PRODUCTS_ADD"),validation_create_product], ProductController.update);
router.post('/update', [ensureLogin,validation_update_product], ProductController.update);
router.post('/search', [], ProductController.search);
router.post('/toggle-active', [ensureLogin,validation_toggle_active], ProductController.toggle_active);
router.delete('/delete/:_id', [ensureLogin,validation_delete_product], ProductController.remove);

module.exports = router;
