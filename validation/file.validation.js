const myLib = require("../myLib");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const {Files} = require("../models/file.model");
const {FileOrder} = require("../models/file-order.model");
const {hasPermission} = require("../myLib");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        var id =Math.floor((Math.random() * 99999) + 11111)+"-" + Date.now() + path.extname(file.originalname);
        cb(null, id);
    }
})
var orderFilestorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/order-files');
    },
    filename: function (req, file, cb) {
        var id =Math.floor((Math.random() * 99999) + 11111)+"-" + Date.now() + path.extname(file.originalname);
        cb(null, id);
    }
})
const uploadProdPics = multer({storage:storage})
const uploadOrderFiles = multer({storage:orderFilestorage})
const validation_upload_file = async (req, res, next) => {
    if (req.body.additional===undefined){
        res.json(myLib.sendResponse(0, "Target is required to store local files"))
        return
    }
    if (req.headers.user_data){
        req.body.created_by=req.headers.user_data._id
    }
    uploadProdPics.any()
    next()
};
const validation_create_file = async (req, res, next) => {
    if (req.headers.user_data){
        req.body.created_by=req.headers.user_data._id
    }
    next()
};
const validation_list_file = async (req, res, next) => {
    if (Object.keys(req.body).length === 0){
        res.json(myLib.sendResponse(0, "Request is empty"))
        return
    }
    var permittedFields=['_id','additional','created_at','is_local','path','reference','updated_at']
    var unauthorizedFieldsExist = Object.keys(req.body).some(field => !permittedFields.includes(field));
    if (unauthorizedFieldsExist) {
        res.json(myLib.sendResponse(0, "Unknown fields present in request"))
        return
    } else {
        next()
    }
};
const validation_delete_file = async (req, res, next) => {
    if (req.params._id===undefined||!mongoose.Types.ObjectId.isValid(req.params._id)){
        res.json(myLib.sendResponse(0, "Invalid ID"))
        return
    }
    file=Files.findById(req.params._id).lean().exec()
    if (!file){
        res.json(myLib.sendResponse(0, "Incorrect ID"))
        return
    }
    next()
};
const validation_update_file = async (req, res, next) => {
    if (req.body.additional===undefined){
        res.json(myLib.sendResponse(0, "Target is required to store local files"))
        return
    }
    file=await Files.find({additional:req.body.additional}).lean().exec()
    if (!file){
        res.json(myLib.sendResponse(0, "Incorrect additional id"))
        return
    }
    next()
};
const validation_update_file_by_id = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params._id)){
        res.json(myLib.sendResponse(0, "Invalid Id"))
        return
    }
    file=await Files.findById(req.params._id)
    if (!file){
        res.json(myLib.sendResponse(0, file))
        return
    }
    if (file.created_by!==req.headers.user_data._id){
        if (!hasPermission(req.headers.user_data.role,'USERS_EDIT')){
            res.json(myLib.sendResponse(0, "You cant perform this operation"))
            return
        }
    }
    next()
};
module.exports = {validation_list_file,validation_create_file,validation_upload_file,validation_update_file,validation_update_file_by_id,validation_delete_file}
