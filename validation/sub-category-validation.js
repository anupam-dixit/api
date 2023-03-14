const myLib = require("../myLib")
const {SubCategory} = require("../models/sub-category.model")
const mongoose = require("mongoose");
const {Category} = require("../models/category.model");
const validation_create_sub_category = async (req, res, next) => {
    if (req.body.title===undefined||req.body.title.length<3){
        res.json(myLib.sendResponse(0, "Provide correct title pls"))
        return
    }
    if (!Array.isArray(req.body.categories)){
        res.json(myLib.sendResponse(0, "Categories accepted in array only"))
        return
    }

    for (i=0;i<req.body.categories.length;i++){
        if (!mongoose.Types.ObjectId.isValid(req.body.categories[i])){
            res.json(myLib.sendResponse(0, req.body.categories[i]+" : is invalid id"))
            return
        }
        var tempIdInDb = await Category.findOne({ '_id': req.body.categories[i]})
        if(!tempIdInDb){
            res.json(myLib.sendResponse(0, req.body.categories[i]+" : not found"))
            return
        }
    }
    subCategory = await SubCategory.findOne({title :req.body.title}).lean().exec()
    if (subCategory){
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
const validation_update_sub_category = async (req, res, next) => {
    if (req.body._id===undefined||!mongoose.Types.ObjectId.isValid(req.body._id)){
        res.json(myLib.sendResponse(0, "Invalid ID"))
        return
    }
    category = await SubCategory.findOne({_id :req.body._id}).lean().exec()
    if (!category){
        res.json(myLib.sendResponse(0, "ID not found"))
        return
    }
    if (!Array.isArray(req.body.categories)){
        res.json(myLib.sendResponse(0, "Categories accepted in array only"))
        return
    }

    for (i=0;i<req.body.categories.length;i++){
        if (!mongoose.Types.ObjectId.isValid(req.body.categories[i])){
            res.json(myLib.sendResponse(0, req.body.categories[i]+" : is invalid id"))
            return
        }
        var tempIdInDb = await Category.findOne({ '_id': req.body.categories[i]})
        if(!tempIdInDb){
            res.json(myLib.sendResponse(0, req.body.categories[i]+" : not found"))
            return
        }
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
const validation_delete_sub_category = async (req, res, next) => {
    if (req.params._id===undefined||!mongoose.Types.ObjectId.isValid(req.params._id)){
        res.json(myLib.sendResponse(0, "Invalid ID"))
        return
    }
    category = await SubCategory.findOne({_id :req.params._id}).lean().exec()
    if (!category){
        res.json(myLib.sendResponse(0, "ID not found"))
        return
    }
    next()
};
module.exports = {validation_create_sub_category,validation_update_sub_category,validation_delete_sub_category}
