const myLib = require("../myLib")
const {Sms} = require("../models/sms.model")
const mongoose = require("mongoose");
const {hasPermission, sendResponse} = require("../myLib");
const Joi = require("joi");
const validation_list_sms = async (req, res, next) => {
    if (!hasPermission(req.headers.user_data.role,'SMS_VIEW_ALL')){
        req.body.phone=req.headers.user_data.phone
    }
    next()
}
const validation_send_otp = async (req, res, next) => {
    const schema=Joi.object({
        phone:Joi.string().required().length(10)
    })
    let validation=schema.validate(req.body)
    if (validation.error){
        res.json(sendResponse(0,validation.error.message))
        return
    }
    var otp = Math.floor(Math.random() * 99999)
    req.body.type='otp'
    req.body.otp=otp
    req.body.templateId='1707167291733893032'
    req.body.message="Your sms (Powered by Edumarc Technologies) OTP for verification is: " + otp + ". Code is valid for 2 minutes. OTP is confidential, refrain from sharing it with anyone."
    next()
}
const validation_send_sms = async (req, res, next) => {
    const schema=Joi.object({
        phone:Joi.string().required().length(10),
        templateId:Joi.string().required(),
        message:Joi.string().required(),
    })
    let validation=schema.validate(req.body)
    if (validation.error){
        res.json(sendResponse(0,validation.error.message))
        return
    }
    req.body.type='sms'
    next()
}
const validation_update_cart = async (req, res, next) => {

    next()
};
const validation_delete_cart = async (req, res, next) => {
    next()
};
module.exports = {validation_list_sms,validation_send_sms,validation_send_otp,validation_update_cart,validation_delete_cart}
