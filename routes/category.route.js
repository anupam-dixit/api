var express = require('express');
var router = express.Router();
const CategoryController=require('../controllers/category.controller');
const {ensureLogin} = require("../middleware/auth");
const {validation_create_category, validation_update_category, validation_delete_category} = require("../validation/category.validation");
const {ensurePermission} = require("../middleware/ensurePermission");

/* GET users listing. */
router.post('/create', [ensureLogin,ensurePermission('CATEGORY_CREATE'),validation_create_category], CategoryController.create);
router.post('/update', [ensureLogin,ensurePermission('CATEGORY_UPDATE'),validation_update_category], CategoryController.update);
router.delete('/delete/:_id', [ensureLogin,ensurePermission('CATEGORY_DELETE'),validation_delete_category], CategoryController.remove);
router.post('/list', [], CategoryController.list);

module.exports = router;
