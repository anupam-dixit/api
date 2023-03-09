const myLib = require("../myLib")
const {Domain} = require("../models/domain.model")
const mongoose = require("mongoose");
const validation_create_domain = async (req, res, next) => {
    if (req.body.title===undefined||req.body.title.length<3){
        res.json(myLib.sendResponse(0, "Provide correct title pls"))
        return
    }

    const domain = await Domain.findOne({title :req.body.title}).lean().exec()
    if (domain){
        res.json(myLib.sendResponse(0, "This title is already in use"))
        return
    }
    next()
};
const validation_update_domain = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.body._id)){
        res.json(myLib.sendResponse(0, "Invalid id provided"))
        return
    }
    domain = await Domain.findOne({_id :req.body._id}).lean().exec()
    if (!domain){
        res.json(myLib.sendResponse(0, "Domain Id not found"))
        return
    }
    if (req.body.title===undefined||req.body.title.length<3){
        res.json(myLib.sendResponse(0, "Provide correct title pls"))
        return
    }
    domain = await Domain.findOne({title :req.body.title}).lean().exec()
    if (domain){
        res.json(myLib.sendResponse(0, "This title is already in use"))
        return
    }
    next()
};
const validation_delete_domain = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.body._id)){
        res.json(myLib.sendResponse(0, "Invalid id provided"))
        return
    }
    domain = await Domain.findOne({_id :req.body._id}).lean().exec()
    if (!domain){
        res.json(myLib.sendResponse(0, "Domain Id not found"))
        return
    }
    next()
};
module.exports = {validation_create_domain,validation_update_domain,validation_delete_domain}
