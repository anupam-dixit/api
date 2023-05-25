const myLib = require("../myLib");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const {Files} = require("../models/file.model");
const {FileOrder} = require("../models/file-order.model");
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
    uploadProdPics.any()
    next()
};
const validation_delete_file = async (req, res, next) => {
    if (req.params._id===undefined||!mongoose.Types.ObjectId.isValid(req.params._id)){
        res.json(myLib.sendResponse(0, "Invalid ID"))
        return
    }
    file=Files.findById(req.body._id).lean().exec()
    if (!file){
        res.json(myLib.sendResponse(0, "Incorrect ID"))
        return
    }
    next()
};
module.exports = {validation_upload_file,validation_delete_file}
