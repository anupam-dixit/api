const myLib = require("../myLib")
const mongoose = require("mongoose");
const {Role} = require("../models/role.model");
const {Permission} = require("../models/permission.model");
const {RoleHasPermission} = require("../models/role-has-permission.model");

const validation_role_list = async (req, res, next) => {
    if (req.body._id!==undefined){
        req.body._id=mongoose.Types.ObjectId(req.body._id)
    }
    next()
};
const validation_role_create = async (req, res, next) => {
    if (req.body.title===undefined){
        res.json(myLib.sendResponse(0, "Title is required"))
        return
    }
    roleAlreadyInDb=await Role.findOne({title:req.body.title}).lean().exec()
    if(roleAlreadyInDb){
        res.json(myLib.sendResponse(0, "This role is already in database"))
        return
    }
    req.body.code=req.body.title.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g,'_');
    next()
};
const validation_role_update = async (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.body._id)){
        res.json(myLib.sendResponse(0, "Incorrect ID"))
        return
    }
    roleAlreadyInDb=await Role.findById(req.body._id).lean().exec()
    if(!roleAlreadyInDb){
        res.json(myLib.sendResponse(0, "Incorrect Role ID"))
        return
    }
    req.body.code=req.body.title.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g,'_');
    next()
};
const validation_role_delete = async (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.body._id)){
        res.json(myLib.sendResponse(0, "Incorrect ID"))
        return
    }
    roleAlreadyInDb=await Role.findById(req.body._id).lean().exec()
    if(!roleAlreadyInDb){
        res.json(myLib.sendResponse(0, "Incorrect Role ID"))
        return
    }
    next()
};

const validation_permission_create = async (req, res, next) => {
    if (req.body.title===undefined){
        res.json(myLib.sendResponse(0, "Title is required"))
        return
    }
    permissionAlreadyInDb=await Permission.findOne({title:req.body.title.toUpperCase()}).lean().exec()
    if(permissionAlreadyInDb){
        res.json(myLib.sendResponse(0, "This permission is already in database"))
        return
    }
    req.body.code=req.body.title.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g,'_');
    next()
};
const validation_permission_update = async (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.body._id)){
        res.json(myLib.sendResponse(0, "Incorrect ID"))
        return
    }
    permissionAlreadyInDb=await Permission.findById(req.body._id).lean().exec()
    if(!permissionAlreadyInDb){
        res.json(myLib.sendResponse(0, "Incorrect Permission ID"))
        return
    }
    req.body.code=req.body.title.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g,'_');
    next()
};
const validation_permission_delete = async (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.body._id)){
        res.json(myLib.sendResponse(0, "Incorrect ID"))
        return
    }
    permissionAlreadyInDb=await Permission.findById(req.body._id).lean().exec()
    if(!permissionAlreadyInDb){
        res.json(myLib.sendResponse(0, "Incorrect Permission ID"))
        return
    }
    next()
};
const validation_role_has_permission_create = async (req, res, next) => {
    if (req.body.role===undefined){
        res.json(myLib.sendResponse(0, "Role is required"))
        return
    }
    role=await Role.findOne({code:req.body.role}).lean().exec()
    if (!role){
        res.json(myLib.sendResponse(0, "Role is invalid"))
        return
    }
    rolePermissionAlready=await RoleHasPermission.find({role:req.body.role}).lean().exec()
    if (rolePermissionAlready.length>0){
        res.json(myLib.sendResponse(0, "This role has already permissions"))
        return
    }
    if (req.body.permission===undefined){
        res.json(myLib.sendResponse(0, "Permission is required"))
        return
    }
    if (typeof req.body.permission!=='object' || !req.body.permission.length){
        res.json(myLib.sendResponse(0, "Permission is required and in array"))
        return
    }
    // req.body.code=req.body.title.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g,'_');
    next()
};
const validation_role_has_permission_list_my = async (req, res, next) => {
    if (req.body.role===undefined){
        res.json(myLib.sendResponse(0, "Role is required"))
        return
    }
    inDb=await RoleHasPermission.find({role:req.body.role}).lean().exec()
    if (!inDb){
        res.json(myLib.sendResponse(0, "Invalid role code"))
        return
    }
    next()
};
const validation_role_has_permission_update = async (req, res, next) => {
    if (req.body.role===undefined){
        res.json(myLib.sendResponse(0, "Role is required"))
        return
    }
    role=await Role.findOne({code:req.body.role}).lean().exec()
    if (!role){
        res.json(myLib.sendResponse(0, "Role is invalid"))
        return
    }
    if (req.body.permission===undefined){
        res.json(myLib.sendResponse(0, "Permission is required"))
        return
    }
    if (typeof req.body.permission!=='object' || !req.body.permission.length){
        res.json(myLib.sendResponse(0, "Permission is required and in array"))
        return
    }
    // req.body.code=req.body.title.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g,'_');
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
module.exports = {validation_role_list,validation_role_create,validation_role_update,validation_role_delete,validation_permission_delete,validation_role_has_permission_create,validation_permission_update,validation_permission_create,validation_role_has_permission_list_my,validation_role_has_permission_update,validation_delete_cart}
