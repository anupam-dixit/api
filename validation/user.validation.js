
const myLib = require("../myLib");
const {User} = require("../models/user.model");
const mongoose = require("mongoose");
const Joi = require("joi");
const {number, invalid} = require("joi");
const {sendResponse} = require("../myLib");
const {Domain} = require("../models/domain.model");
const validation_list_user = async (req, res, next) => {
    if (await myLib.hasPermission(req.headers.user_data.role, 'USERS_VIEW_ALL')===false){
        // If not super admin then show self data
        req.body._id=req.headers.user_data._id
    }
    next()
};
const validation_list_vendors = async (req, res, next) => {
    if (req.body.pincode===undefined&&req.body.location===undefined){
        res.json(myLib.sendResponse(0, "Pincode or Co-Ordinates required"))
        return
    }
    if (req.body.location!==undefined&&typeof req.body.location!='object'){
        res.json(myLib.sendResponse(0, "Location must be an array"))
        return
    }
    if (req.body.location!==undefined&&typeof req.body.location=='object'&&req.body.max_distance===undefined){
        res.json(myLib.sendResponse(0, "Distance required with location"))
        return
    }
    next()
};
const validation_list_vendors_by_product_search_location = async (req, res, next) => {
    if (req.body.search===undefined){
        res.json(myLib.sendResponse(0, "Please search something"))
        return
    }
    if (req.body.location===undefined){
        res.json(myLib.sendResponse(0, "Location is required"))
        return
    }
    if (typeof req.body.location!=='object'){
        res.json(myLib.sendResponse(0, "Location required as Longitude, Lattitude"))
        return
    }
    if (req.body.location[0]==null){
        res.json(myLib.sendResponse(0, "Please click the location button"))
        return
    }
    if (!eval(req.body.max_distance)){
        req.body.max_distance=5
    }
    if (typeof req.body.max_distance!=='number'){
        req.body.max_distance=parseInt(req.body.max_distance)
    }
    if (parseInt(req.body.max_distance)===0){
        res.json(myLib.sendResponse(0, "Maximum distance can not be zero"))
        return
    }
    req.body.location[0]=eval(req.body.location[0])
    req.body.location[1]=eval(req.body.location[1])
    next()
};
const validation_list_vendors_by_domain_location = async (req, res, next) => {
    const schema = Joi.object({
        location: Joi.array().items(Joi.number().required().greater(0),Joi.number().required().greater(0)),
        max_distance: Joi.number().required().greater(0),
        domain: Joi.string().required(),
        search: Joi.string().allow('')
    })
    validation=schema.validate(req.body)

    if (!validation.error&&!mongoose.isValidObjectId(req.body.domain)){
        validation={
            error: {message:'Invalid domain id'}
        }
    }
    inDb=await Domain.findOne({_id:req.body.domain}).lean()
    if (!validation.error&&!inDb){
        validation={
            error: {message:'Invalid domain id'}
        }
    }
    if (validation.error){
        res.json(sendResponse(0,validation.error.message))
        return
    }
    req.body.domain=mongoose.Types.ObjectId(req.body.domain)
    req.body.location[0]=Number(req.body.location[0])
    req.body.location[1]=Number(req.body.location[1])
    req.body.max_distance=Number(req.body.max_distance)*1000
    next()
};
const validation_list_vendors_by_domain_pincode = async (req, res, next) => {
    const schema = Joi.object({
        pincode: Joi.array().items(Joi.string().length(6)).min(1),
        domain: Joi.string().required(),
        search:Joi.string().allow('')
    })
    validation=schema.validate(req.body)

    if (!validation.error&&!mongoose.isValidObjectId(req.body.domain)){
        validation={
            error: {message:'Invalid domain id'}
        }
    }
    inDb=await Domain.findOne({_id:req.body.domain}).lean()
    if (!validation.error&&!inDb){
        validation={
            error: {message:'Invalid domain id'}
        }
    }
    if (validation.error){
        res.json(sendResponse(0,validation.error.message))
        return
    }
    req.body.domain=mongoose.Types.ObjectId(req.body.domain)
    next()
};
const validation_list_vendors_by_product_search_pincode = async (req, res, next) => {
    if (req.body.pincode===undefined){
        res.json(myLib.sendResponse(0, "Please provide pincode"))
        return
    }
    req.body.pincode=req.body.pincode.map(d=>d.toString())
    next()
};
const validation_create_user = async (req, res, next) => {
    if (req.body.name===undefined||req.body.name.length<3){
        res.json(myLib.sendResponse(0, "Name too short"))
        return
    }
    if (req.body.phone===undefined||req.body.phone.length!==10){
        res.json(myLib.sendResponse(0, "Phone number only 10 digits permitted"))
        return
    }
    var user_by_phone = await User.find({phone: req.body.phone}).lean().exec()
    if (user_by_phone.length){
        res.json(myLib.sendResponse(0, "Phone number already registered"))
        return
    }
    if (req.body.password===undefined||req.body.password.length<3){
        res.json(myLib.sendResponse(0, "Password can not be too short"))
        return
    }
    if (req.body.email!==undefined){
        if (!req.body.email.includes("@")||!req.body.email.includes(".")){
            res.json(myLib.sendResponse(0, "Invalid Email"))
            return
        }
        var user_by_email = await User.find({phone: req.body.phone}).lean().exec()
        if (user_by_email.length){
            res.json(myLib.sendResponse(0, "Email already registered"))
            return
        }
    }
    next()
};
const validation_update_user = async (req,res,next) =>{
    if (!mongoose.Types.ObjectId.isValid(req.body._id)){
        res.json(myLib.sendResponse(0, "Invalid ID"))
        return
    }
    var user = await User.findById(req.body._id).lean().exec()
    if (!user){
        res.json(myLib.sendResponse(0, "User not found"))
        return
    }
    next()
};
const validation_update_with_phone = async (req,res,next) =>{
    if (req.body.phone===undefined||req.body.phone===''){
        res.json(myLib.sendResponse(0, "10 Digit Phone number required"))
        return
    }
    if (req.body.phone.length!==10){
        res.json(myLib.sendResponse(0, "10 Digit Phone number required"))
        return
    }
    var user = await User.findOne({phone:req.body.phone}).lean().exec()
    if (!user){
        res.json(myLib.sendResponse(0, "User not found"))
        return
    }
    next()
};
const validation_send_reset_password_otp = async (req, res, next) => {
    if (req.body.phone===undefined||eval(req.body.phone.length)!=10){
        res.json(myLib.sendResponse(0, "Please provide 10 digits phone number"))
        return
    }
    inDb=await User.findOne({phone: req.body.phone}).lean().exec()
    if (!inDb){
        res.json(myLib.sendResponse(0, "This phone number is not registered"))
        return
    }
    next()
};
module.exports = {validation_list_vendors_by_domain_pincode,validation_list_vendors_by_domain_location,validation_list_user,validation_update_with_phone,validation_list_vendors,validation_list_vendors_by_product_search_location,validation_list_vendors_by_product_search_pincode, validation_create_user,validation_update_user,validation_send_reset_password_otp}
