const myLib = require("../myLib")
const {Product} = require("../models/product.model")
const mongoose = require("mongoose");
const {User} = require("../models/user.model");
const {Category} = require("../models/category.model");
const {SubCategory} = require("../models/sub-category.model");
const {Mongoose} = require("mongoose");
const { body, validationResult } = require('express-validator');
const validation_create_product = async (req, res, next) => {
    if (req.body.name===undefined||req.body.name.length<3){
        res.json(myLib.sendResponse(0, "Provide correct title pls"))
        return
    }
    if (req.body.mrp===undefined||isNaN(parseInt(req.body.mrp))){
        res.json(myLib.sendResponse(0, "Provide MRP"))
        return
    }
    if (req.body.domain===undefined||!mongoose.Types.ObjectId.isValid(req.body.domain)){
        res.json(myLib.sendResponse(0, "Invalid Domain"))
        return
    }
    if (req.body.categ===undefined||!mongoose.Types.ObjectId.isValid(req.body.categ)){
        res.json(myLib.sendResponse(0, "Invalid Category"))
        return
    }
    if (req.body.sub_categ[0]!==null){
        if (!Array.isArray(req.body.sub_categ)){
            res.json(myLib.sendResponse(0, "Subcategories to be in array"))
            return
        }
        for (i=0;i<req.body.sub_categ.length;i++){
            if (!mongoose.Types.ObjectId.isValid(req.body.sub_categ[i])){
                res.json(myLib.sendResponse(0, req.body.sub_categ[i]+" : is invalid subcategory id"))
                return
            }
            var tempIdInDb = await SubCategory.findOne({ '_id': req.body.sub_categ[i]})
            if(!tempIdInDb){
                res.json(myLib.sendResponse(0, req.body.sub_categ[i]+" : not found"))
                return
            }
        }
    } else{
        delete req.body['sub_categ']
    }
    vendor=req.headers.user_data
    found=false
    for (i=0;i<vendor.permits.domains.length;i++){
        if (vendor.permits.domains[i]==req.body.domain){
            found=true
        }
    }
    if (!found){
        res.json(myLib.sendResponse(0, found))
        return
    }
    if (!req.body.hasOwnProperty('price_mod')){
        req.body.price_mod={
            vendor:{
                mod_sign: '-',
                mod_type: 'n',
                mod_amount: '0',
            }
        }
    }
    if (vendor.permits.hasOwnProperty('discount_range')){
        if (vendor.permits.discount_range.hasOwnProperty('flat')){
            if (vendor.permits.discount_range.flat[0]!==undefined&&req.body.price_mod.vendor.mod_type==='n'){
                // Validate minimum flat discount if isset by admin
                if (req.body.price_mod.vendor.mod_amount<vendor.permits.discount_range.flat[0]){
                    res.json(myLib.sendResponse(0, "Flat discount can not be less than "+vendor.permits.discount_range.flat[0]))
                    return
                }
            }
            if (vendor.permits.discount_range.flat[1]!==undefined&&req.body.price_mod.vendor.mod_type==='n'){
                // Validate minimum flat discount if isset by admin
                if (req.body.price_mod.vendor.mod_amount>vendor.permits.discount_range.flat[1]){
                    res.json(myLib.sendResponse(0, "Flat discount can not be greater than "+vendor.permits.discount_range.flat[1]))
                    return
                }
            }
        }
        if (vendor.permits.discount_range.hasOwnProperty('percent')) {
            if (vendor.permits.discount_range.percent[0] !== undefined&&req.body.price_mod.vendor.mod_type==='%') {
                // Validate minimum percent discount if isset by admin
                if (req.body.price_mod.vendor.mod_amount<vendor.permits.discount_range.percent[0]) {
                    res.json(myLib.sendResponse(0, "Minimum percent discount can not be less than " + vendor.permits.discount_range.percent[0]))
                    return
                }
            }
            if (vendor.permits.discount_range.percent[1] !== undefined&&req.body.price_mod.vendor.mod_type==='%') {
                // Validate minimum percent discount if isset by admin
                if (req.body.price_mod.vendor.mod_amount>vendor.permits.discount_range.percent[1]) {
                    res.json(myLib.sendResponse(0, "Maximum percent discount can not be greater than " + vendor.permits.discount_range.percent[1]))
                    return
                }
            }
        }
    }
    next()
};
const validation_update_product = async (req, res, next) => {
    if (req.body._id===undefined||!mongoose.Types.ObjectId.isValid(req.body._id)){
        res.json(myLib.sendResponse(0, "Invalid ID"))
        return
    }
    prod=await Product.findById(req.body._id).lean().exec()
    if (!prod){
        res.json(myLib.sendResponse(0, "Incorrect ID"))
        return
    }
    if (req.body.name===undefined||req.body.name.length<3){
        res.json(myLib.sendResponse(0, "Provide correct title pls"))
        return
    }
    if (req.body.mrp===undefined||isNaN(parseInt(req.body.mrp))){
        res.json(myLib.sendResponse(0, "Provide MRP"))
        return
    }
    if (req.body.domain===undefined||!mongoose.Types.ObjectId.isValid(req.body.domain)){
        res.json(myLib.sendResponse(0, "Invalid Domain"))
        return
    }
    if (req.body.categ===undefined||!mongoose.Types.ObjectId.isValid(req.body.categ)){
        res.json(myLib.sendResponse(0, "Invalid Category"))
        return
    }
    if (req.body.sub_categ[0]!==null){
        if (!Array.isArray(req.body.sub_categ)){
            res.json(myLib.sendResponse(0, "Subcategories to be in array"))
            return
        }
        for (i=0;i<req.body.sub_categ.length;i++){
            if (!mongoose.Types.ObjectId.isValid(req.body.sub_categ[i])){
                res.json(myLib.sendResponse(0, req.body.sub_categ[i]+" : is invalid subcategory id"))
                return
            }
            var tempIdInDb = await SubCategory.findOne({ '_id': req.body.sub_categ[i]})
            if(!tempIdInDb){
                res.json(myLib.sendResponse(0, req.body.sub_categ[i]+" : not found"))
                return
            }
        }
    } else{
        delete req.body['sub_categ']
    }
    vendor=req.headers.user_data
    found=false
    for (i=0;i<vendor.permits.domains.length;i++){
        if (vendor.permits.domains[i]==req.body.domain){
            found=true
        }
    }
    if (!found){
        res.json(myLib.sendResponse(0, found))
        return
    }
    if (!req.body.hasOwnProperty('price_mod')){
        req.body.price_mod={
            vendor:{
                mod_sign: '-',
                mod_type: 'n',
                mod_amount: '0',
            }
        }
    }
    if (vendor.permits.hasOwnProperty('discount_range')){
        if (vendor.permits.discount_range.hasOwnProperty('flat')){
            if (vendor.permits.discount_range.flat[0]!==undefined&&req.body.price_mod.vendor.mod_type==='n'){
                // Validate minimum flat discount if isset by admin
                if (req.body.price_mod.vendor.mod_amount<vendor.permits.discount_range.flat[0]){
                    res.json(myLib.sendResponse(0, "Flat discount can not be less than "+vendor.permits.discount_range.flat[0]))
                    return
                }
            }
            if (vendor.permits.discount_range.flat[1]!==undefined&&req.body.price_mod.vendor.mod_type==='n'){
                // Validate minimum flat discount if isset by admin
                if (req.body.price_mod.vendor.mod_amount>vendor.permits.discount_range.flat[1]){
                    res.json(myLib.sendResponse(0, "Flat discount can not be greater than "+vendor.permits.discount_range.flat[1]))
                    return
                }
            }
        }
        if (vendor.permits.discount_range.hasOwnProperty('percent')) {
            if (vendor.permits.discount_range.percent[0] !== undefined&&req.body.price_mod.vendor.mod_type==='%') {
                // Validate minimum percent discount if isset by admin
                if (req.body.price_mod.vendor.mod_amount<vendor.permits.discount_range.percent[0]) {
                    res.json(myLib.sendResponse(0, "Minimum percent discount can not be less than " + vendor.permits.discount_range.percent[0]))
                    return
                }
            }
            if (vendor.permits.discount_range.percent[1] !== undefined&&req.body.price_mod.vendor.mod_type==='%') {
                // Validate minimum percent discount if isset by admin
                if (req.body.price_mod.vendor.mod_amount>vendor.permits.discount_range.percent[1]) {
                    res.json(myLib.sendResponse(0, "Maximum percent discount can not be greater than " + vendor.permits.discount_range.percent[1]))
                    return
                }
            }
        }
    }
    next()
};
const validation_delete_product = async (req, res, next) => {
    // if (!mongoose.Types.ObjectId.isValid(req.body._id)){
    //     res.json(myLib.sendResponse(0, "Invalid id provided"))
    //     return
    // }
    // domain = await Domain.findOne({_id :req.body._id}).lean().exec()
    // if (!domain){
    //     res.json(myLib.sendResponse(0, "Domain Id not found"))
    //     return
    // }
    next()
};
module.exports = {validation_create_product,validation_update_product,validation_delete_product}

/** Below is the res.req.files after multer middleware in the controller function
 * [
 *   {
 *     fieldname: 'field_pic',
 *     originalname: '688304.jpg',
 *     encoding: '7bit',
 *     mimetype: 'image/jpeg',
 *     destination: 'public/images/products',
 *     filename: '107578-1679453909032.jpg',
 *     path: 'public\\images\\products\\107578-1679453909032.jpg',
 *     size: 2047512
 *   }
 * ]
 */
