var express = require('express');
var router = express.Router();
const NotificationController=require('../controllers/notification.controller');
const {validation_create_notification, validation_list_notification, validation_update_notification,
    validation_delete_notification, validation_create_notification_by_permission
} = require("../validation/notification.validation");
const {ensureLogin} = require("../middleware/auth");

router.post('/create',[validation_create_notification], NotificationController.create);
router.post('/list',[ensureLogin,validation_list_notification], NotificationController.list);
router.post('/update/:_id?',[ensureLogin,validation_update_notification], NotificationController.update);
router.delete('/delete/:_id?',[ensureLogin,validation_delete_notification], NotificationController.remove);
router.post('/list/dt',[ensureLogin], NotificationController.listDt);

module.exports = router;
