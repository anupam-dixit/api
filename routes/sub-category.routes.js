var express = require('express');
var router = express.Router();
const SubCategoryController=require('../controllers/sub-category-controller');
const {ensureLogin} = require("../middleware/auth");
const {validation_create_sub_category, validation_update_sub_category, validation_delete_sub_category} = require("../validation/sub-category-validation");
const {ensurePermission} = require("../middleware/ensurePermission");

/* GET users listing. */
router.post('/list', [], SubCategoryController.list);
router.post('/create', [ensureLogin,ensurePermission("SUB_CATEGORY_CREATE"),validation_create_sub_category], SubCategoryController.create);
router.post('/update', [ensureLogin,ensurePermission("SUB_CATEGORY_UPDATE") ,validation_update_sub_category], SubCategoryController.update);
router.delete('/delete/:_id', [ensureLogin,ensurePermission("SUB_CATEGORY_DELETE") ,validation_delete_sub_category], SubCategoryController.remove);

module.exports = router;
