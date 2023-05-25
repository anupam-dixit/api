var express = require('express');
var router = express.Router();
const AccessController=require('../controllers/access.controller');
const {validation_role_create, validation_permission_create, validation_role_has_permission_create,
    validation_permission_update, validation_role_update, validation_permission_delete, validation_role_delete,
    validation_role_has_permission_update, validation_role_has_permission_list_my, validation_role_list
} = require("../validation/access-control.validation");
const {ensureLogin} = require("../middleware/auth");

router.post('/permission/list',[], AccessController.permissionList);
router.post('/permission/create',[validation_permission_create], AccessController.permissionCreate);
router.post('/permission/update',[validation_permission_update], AccessController.permissionUpdate);
// router.post('/permission/delete',[validation_permission_delete], AccessController.perd);

router.post('/role/list',[validation_role_list], AccessController.roleList);
router.post('/role/create',[validation_role_create], AccessController.roleCreate);
router.post('/role/update',[validation_role_update], AccessController.roleUpdate);
router.delete('/role/delete',[validation_role_delete], AccessController.roleDelete);

router.post('/role-has-permission/create',[validation_role_has_permission_create], AccessController.roleHasPermissionCreate);
router.post('/role-has-permission/update',[validation_role_has_permission_update], AccessController.roleHasPermissionUpdate);
router.post('/role-has-permission/verify',[], AccessController.roleHasPermissionVerify);
router.post('/role-has-permission/my',[ensureLogin], AccessController.myRolePermissions);
// router.post('/role-has-permission/list',[], AccessController.roleHasPermissionList);

module.exports = router;
