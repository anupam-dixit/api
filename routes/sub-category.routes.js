var express = require('express');
var router = express.Router();
const SubCategoryController=require('../controllers/sub-category-controller');
const {ensureLogin} = require("../middleware/auth");
const {ensureAdmin} = require("../middleware/ensureAdmin");
const {validation_create_sub_category, validation_update_sub_category, validation_delete_sub_category} = require("../validation/sub-category-validation");

/* GET users listing. */
router.get('/list', [], SubCategoryController.list);
router.post('/create', [ensureLogin,ensureAdmin,validation_create_sub_category,ensureAdmin], SubCategoryController.create);
router.post('/update', [ensureLogin,ensureAdmin,validation_update_sub_category,ensureAdmin], SubCategoryController.update);
router.delete('/delete/:_id', [ensureLogin,ensureAdmin,validation_delete_sub_category(),ensureAdmin], SubCategoryController.remove);

module.exports = router;
