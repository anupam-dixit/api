const myLib = require("../myLib")
const {Notification} = require("../models/notification.model")
const mongoose = require("mongoose");
const {Product} = require("../models/product.model");
const {sendResponse} = require("../myLib");
const Joi = require("joi");
const {User} = require("../models/user.model");
const {Permission} = require("../models/permission.model");
const validation_create_notification = async (req, res, next) => {
    if (req.body.target_user_id&&req.body.permission){
        res.json(sendResponse(0,'Provide either target_user_id or permission'))
        return
    }
    const schema_1 = Joi.object({
        title: Joi.string().required(),
        description:Joi.string().required(),
        target_user_id:Joi.string().required(),
        reference:Joi.string().required(),
        status:Joi.string().optional(),
        level:Joi.number().valid(1,2,3).optional()
    }).unknown();
    const schema_2 = Joi.object({
        title: Joi.string().required(),
        description:Joi.string().required(),
        permission:Joi.array().required().items(Joi.string()).min(1),
        reference:Joi.string().required(),
        status:Joi.string().optional(),
        level:Joi.number().valid(1,2,3).optional()
    }).unknown();
    let validation ;
    if (req.body.target_user_id!==undefined){
        validation=schema_1.validate(req.body)
    } else {
        validation=schema_2.validate(req.body)
    }

    if (!validation.error&&req.body.target_user_id!==undefined){
        if (!mongoose.isValidObjectId(req.body.target_user_id||!await User.findOne({_id:req.body._id}).lean())){
            validation={
                error:{
                    message:'Invalid target user id'
                }
            }
        }
    }
    if (validation.error) {
        res.json(sendResponse(0,validation.error.message))
        return
    } else {
        next()
    }
};
const validation_list_notification = async (req, res, next) => {
    next()
};
const validation_update_notification = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)){
        res.json(myLib.sendResponse(0, "Invalid id provided"))
        return
    }
    notification = await Notification.findOne({_id :req.params._id}).lean()
    if (!notification){
        res.json(myLib.sendResponse(0, "Id not found"))
        return
    }
    if (notification.target_user_id.toString()!==req.headers.user_data._id.toString()){
        res.json(myLib.sendResponse(0, "You can not perform this action"))
        return
    }
    next()
};
const validation_delete_notification = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)){
        res.json(myLib.sendResponse(0, "Invalid id provided"))
        return
    }
    notification = await Notification.findOne({_id :req.params._id}).lean()
    if (!notification){
        res.json(myLib.sendResponse(0, "Id not found"))
        return
    }
    if (notification.target_user_id.toString()!==req.headers.user_data._id.toString()){
        res.json(myLib.sendResponse(0, "You can not perform this action"))
        return
    }
    next()
};
module.exports = {validation_update_notification,validation_list_notification,validation_create_notification,validation_delete_notification}
