var express = require('express');
var router = express.Router();
const DomainController=require('../controllers/domain.controller');
const {ensureLogin} = require("../middleware/auth");
const {ensureAdmin} = require("../middleware/ensureAdmin");
const {validation_create_domain, validation_update_domain, validation_delete_domain} = require("../validation/domain.validation");
const {ensureVendor} = require("../middleware/ensureVendor");

/* GET users listing. */
router.post('/create', [ensureLogin,ensureAdmin,validation_create_domain], DomainController.create);
router.post('/update', [ensureLogin,ensureAdmin,validation_update_domain], DomainController.update);
router.post('/delete', [ensureLogin,ensureAdmin,validation_delete_domain], DomainController.remove);
router.post('/list', [ensureLogin], DomainController.list);
router.post('/permitted-domains', [ensureLogin,ensureVendor], DomainController.permittedDomains);

module.exports = router;
