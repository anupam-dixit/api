const {sendResponse, hasPermission} = require("../myLib");
const {Subscription} = require("../models/subscription.model");
const mongoose = require("mongoose");
const {SubscriptionMember} = require("../models/subscription-member.model");
const {now} = require("mongoose");
const moment = require("moment");
const Joi = require("joi");
const validation_create_subscription = async (req, res, next) => {
    if (req.body.title===undefined){
        res.json(sendResponse(0,"Title is required"))
        return
    }
    if (await Subscription.find({title:req.body.title}).countDocuments()>0){
        res.json(sendResponse(0,"This title is already taken"))
        return
    }
    if (typeof req.body.level!=="number"){
        res.json(sendResponse(0,"Level is required in integer"))
        return
    }
    if (typeof req.body.price!=="number"){
        res.json(sendResponse(0,"Price is required in integer"))
        return
    }
    if (typeof req.body.validity!=="number"){
        res.json(sendResponse(0,"Validity Days required in integer"))
        return
    }
    if (req.body.details===undefined){
        res.json(sendResponse(0,"Details are required"))
        return
    }
    next()
};
const validation_list_subscription_members = async (req, res, next) => {
    if (!hasPermission(req.headers.user_data.role,"SUBSCRIPTION_MEMBERS_LIST_ALL")){
        req.body.created_by=req.headers.user_data._id
    }
    next()
};
const validation_apply_subscription = async (req, res, next) => {
    if (req.headers.user_data.role!=="VENDOR"){
        res.json(sendResponse(0,"Only vendors can apply for subscription"))
        return
    }
    if (!mongoose.isValidObjectId(req.body.subscription_id)){
        res.json(sendResponse(0,"Invalid Subscription id"))
        return
    }
    subscriptionInDb=await Subscription.findById(req.body.subscription_id)
    if (!subscriptionInDb||!subscriptionInDb.active){
        res.json(sendResponse(0,"Either Subscription not found or active"))
        return
    }
    membershipAlready=await SubscriptionMember.find({$and:[{created_by:req.headers.user_data._id},{status:"PENDING"},{subscription_id:req.body.subscription_id}]})
    if (membershipAlready.length>0){
        res.json(sendResponse(0,"You have already applied"))
        return
    }
    next()
};
const validation_delete_subscription = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params._id)){
        res.json(sendResponse(0,"Invalid ID"))
        return
    }
    inDb=await Subscription.findById(req.params._id)
    if (!inDb){
        res.json(sendResponse(0,"Incorrect ID"))
        return
    }
    next()
};
const validation_update_subscription = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.body._id)){
        res.json(sendResponse(0,"Invalid ID"))
        return
    }
    inDb=await Subscription.findById(req.body._id)
    if (!inDb){
        res.json(sendResponse(0,"Incorrect ID"))
        return
    }
    next()
};
const validation_respond_subscription_member = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.body._id)){
        res.json(sendResponse(0,"Invalid membership ID"))
        return
    }
    inDbMember=await SubscriptionMember.findById(req.body._id)
    inDbSubscription=await Subscription.findById(inDbMember.subscription_id)
    if (!inDbMember){
        res.json(sendResponse(0,"Incorrect ID"))
        return
    }
    if (req.body.status==="ACTIVE"){
        req.body.validity={
            start:moment(),
            end:moment().add(parseInt(inDbSubscription.validity),"days")
        }
    }
    next()
};
module.exports = {validation_list_subscription_members,validation_update_subscription,validation_respond_subscription_member,validation_apply_subscription,validation_create_subscription,validation_delete_subscription}
