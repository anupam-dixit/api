const myLib = require("../myLib")
const {Cart} = require("../models/cart.model")
const mongoose = require("mongoose");
const {User} = require("../models/user.model");
const {Product} = require("../models/product.model");
const validation_create_cart = async (req, res, next) => {
    if (req.body.vendor_id===undefined||mongoose.Types.ObjectId.isValid(req.body.vendor_id)){
        res.json(myLib.sendResponse(0, "Provide correct vendor ID"))
        return
    }
    const vendor = await User.findById(req.body.vendor_id).lean().exec()
    if (!vendor){
        res.json(myLib.sendResponse(0, "Provide valid vendor ID"))
        return
    }
    if (!vendor.active){
        res.json(myLib.sendResponse(0, "Vendor is Disabled"))
        return
    }

    if (req.body.product_id===undefined||mongoose.Types.ObjectId.isValid(req.body.product_id)){
        res.json(myLib.sendResponse(0, "Provide correct Product ID"))
        return
    }
    const product = await Product.findById(req.body.product_id).lean().exec()
    if (!product){
        res.json(myLib.sendResponse(0, "Provide valid product ID"))
        return
    }
    if (!product.active.vendor||!product.active.admin){
        res.json(myLib.sendResponse(0, "Product is Disabled"))
        return
    }
    next()
};
const validation_update_cart = async (req, res, next) => {
    // if (!mongoose.Types.ObjectId.isValid(req.body._id)){
    //     res.json(myLib.sendResponse(0, "Invalid id provided"))
    //     return
    // }
    // cart = await Domain.findOne({_id :req.body._id}).lean().exec()
    // if (!cart){
    //     res.json(myLib.sendResponse(0, "Domain Id not found"))
    //     return
    // }
    // if (req.body.title===undefined||req.body.title.length<3){
    //     res.json(myLib.sendResponse(0, "Provide correct title pls"))
    //     return
    // }
    // cart = await Domain.findOne({title :req.body.title}).lean().exec()
    // if (cart){
    //     res.json(myLib.sendResponse(0, "This title is already in use"))
    //     return
    // }
    next()
};
const validation_delete_cart = async (req, res, next) => {
    // if (!mongoose.Types.ObjectId.isValid(req.body._id)){
    //     res.json(myLib.sendResponse(0, "Invalid id provided"))
    //     return
    // }
    // cart = await Domain.findOne({_id :req.body._id}).lean().exec()
    // if (!cart){
    //     res.json(myLib.sendResponse(0, "Domain Id not found"))
    //     return
    // }
    next()
};
module.exports = {validation_create_cart,validation_update_cart,validation_delete_cart}
