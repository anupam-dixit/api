var express = require('express');
var router = express.Router();
const DomainController=require('../controllers/domain.controller');
const {ensureLogin} = require("../middleware/auth");
const {ensurePermission} = require("../middleware/ensurePermission");
const {validation_create_domain, validation_update_domain, validation_delete_domain} = require("../validation/domain.validation");
const {ensureVendor} = require("../middleware/ensureVendor");

/* GET users listing. */
router.post('/create', [ensureLogin,ensurePermission('DOMAIN_CREATE'),validation_create_domain], DomainController.create);
router.post('/update', [ensureLogin,ensurePermission('DOMAIN_CREATE'),validation_update_domain], DomainController.update);
router.post('/delete', [ensureLogin,ensurePermission('DOMAIN_EDIT'),validation_delete_domain], DomainController.remove);
router.post('/list', [], DomainController.list);
router.post('/permitted-domains', [ensureLogin], DomainController.permittedDomains);

module.exports = router;
