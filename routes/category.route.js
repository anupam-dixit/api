var express = require('express');
var router = express.Router();
const CategoryController=require('../controllers/category.controller');
const {ensureLogin} = require("../middleware/auth");
const {ensureAdmin} = require("../middleware/ensureAdmin");
const {validation_create_sub_category, validation_update_sub_category, validation_delete_sub_category} = require("../validation/sub-category-validation");

/* GET users listing. */
router.post('/create', [ensureLogin,ensureAdmin,validation_create_sub_category,ensureAdmin], CategoryController.create);
router.post('/update', [ensureLogin,ensureAdmin,validation_update_sub_category,ensureAdmin], CategoryController.update);
router.delete('/delete/:_id', [ensureLogin,ensureAdmin,validation_delete_sub_category,ensureAdmin], CategoryController.remove);
// router.post('/delete', [ensureLogin,ensureAdmin,validation_delete_domain], DomainController.remove);
router.post('/list', [], CategoryController.list);

module.exports = router;
