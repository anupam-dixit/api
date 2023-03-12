const myLib = require("../myLib")
const {Category} = require("../models/category.model")
const mongoose = require("mongoose");
const validation_create_category = async (req, res, next) => {
    if (req.body.title===undefined||req.body.title.length<3){
        res.json(myLib.sendResponse(0, "Provide correct title pls"))
        return
    }
    const category = await Category.findOne({title :req.body.title}).lean().exec()
    if (category){
        res.json(myLib.sendResponse(0, "This title is already in use"))
        return
    }
    if (req.body.ic_link===undefined||!req.body.ic_link.includes("https://")){
        res.json(myLib.sendResponse(0, "Invalid icon link"))
        return
    }
    req.body.created_by=req.headers.user_data._id
    next()
};
const validation_update_category = async (req, res, next) => {
    if (req.body._id===undefined||!mongoose.Types.ObjectId.isValid(req.body._id)){
        res.json(myLib.sendResponse(0, "Invalid ID"))
        return
    }
    category = await Category.findOne({_id :req.body._id}).lean().exec()
    if (!category){
        res.json(myLib.sendResponse(0, "ID not found"))
        return
    }
    if (req.body.title===undefined||req.body.title.length<3){
        res.json(myLib.sendResponse(0, "Provide correct title pls"))
        return
    }
    if (req.body.ic_link!==undefined&&!req.body.ic_link.includes("https://")){
        res.json(myLib.sendResponse(0, "Invalid icon link"))
        return
    }
    req.body.created_by=req.headers.user_data._id
    next()
};
const validation_delete_category = async (req, res, next) => {
    if (req.params._id===undefined||!mongoose.Types.ObjectId.isValid(req.params._id)){
        res.json(myLib.sendResponse(0, "Invalid ID"))
        return
    }
    category = await Category.findOne({_id :req.params._id}).lean().exec()
    if (!category){
        res.json(myLib.sendResponse(0, "ID not found"))
        return
    }
    next()
};
module.exports = {validation_create_category,validation_update_category,validation_delete_category}
