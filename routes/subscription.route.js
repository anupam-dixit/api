var express = require('express');
var router = express.Router();
const SubscriptionController=require('../controllers/subscription.controller');
const {ensurePermission} = require("../middleware/ensurePermission");
const {ensureLogin} = require("../middleware/auth");
const {validation_create_subscription, validation_delete_subscription, validation_list_subscription_members,
    validation_apply_subscription, validation_respond_subscription_member
} = require("../validation/subscription.validation");

router.post('/create',[ensureLogin, ensurePermission('SUBSCRIPTION_CREATE'),validation_create_subscription], SubscriptionController.create);
router.post('/list',[], SubscriptionController.list);
router.post('/apply',[ensureLogin,validation_apply_subscription], SubscriptionController.apply);
router.post('/list/members',[ensureLogin,validation_list_subscription_members], SubscriptionController.membersList);
router.post('/list/my',[ensureLogin], SubscriptionController.mySubscription);
router.post('/members/respond',[ensureLogin,ensurePermission('MEMBERSHIP_UPDATE'),validation_respond_subscription_member], SubscriptionController.membershipUpdate);
router.post('/update',[ensureLogin, ensurePermission('SUBSCRIPTION_UPDATE'),validation_list_subscription_members], SubscriptionController.update);
router.delete('/delete/:_id',[ensureLogin, ensurePermission('SUBSCRIPTION_DELETE'),validation_delete_subscription], SubscriptionController.remove);

module.exports = router;
