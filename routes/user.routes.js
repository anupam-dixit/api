var express = require('express');
var multer = require('multer');
var router = express.Router();
const UserController=require('../controllers/user.controller');
const {ensureLogin} = require("../middleware/auth");
const {ensurePermission} = require("../middleware/ensurePermission");
const {validation_create_user, validation_update_user,validation_list_user, validation_list_vendors, validation_list_vendors_by_product_search_location,
    validation_list_vendors_by_product_search_pincode,
    validation_send_reset_password_otp,
    validation_update_with_phone,
    validation_list_vendors_by_domain_location,
    validation_list_vendors_by_domain_pincode
} = require("../validation/user.validation");
const {ensureAdmin} = require("../middleware/ensureAdmin");
const {ensureVendor} = require("../middleware/ensureVendor");
const {ensure_token} = require("../middleware/ensure_token");

/* GET users listing. */
router.post('/',[ensureLogin,validation_list_user], UserController.index);
router.post('/vendors',[validation_list_vendors], UserController.vendors);
router.post('/vendors/search-by-product/location',[validation_list_vendors_by_product_search_location], UserController.vendorsByProdSearchByLocation);
router.post('/vendors/search-by-product/pincode',[validation_list_vendors_by_product_search_pincode], UserController.vendorsByProdSearchByPincode);
router.post('/vendors/search-by-domain/location',[validation_list_vendors_by_domain_location], UserController.vendorListByDomainLocation);
router.post('/vendors/search-by-domain/pincode',[validation_list_vendors_by_domain_pincode], UserController.vendorListByDomainPincode);
router.post('/signup', UserController.signup);
router.post('/create', [ensureLogin,validation_create_user], UserController.create);
router.post('/update', [ensureLogin,validation_update_user], UserController.update);
router.post('/update-by-phone', [ensure_token(3000), validation_update_with_phone], UserController.updateByPhone);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/admin/dashboard-data',[ensureLogin, ensureAdmin], UserController.dashboardDataAdmin);
router.get('/vendor/dashboard-data',[ensureLogin, ensureVendor], UserController.dashboardDataVendor);

module.exports = router;
