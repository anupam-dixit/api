const myLib = require("../myLib");
const {Invite} = require("../models/invite.model");
const {User} = require("../models/user.model");
const {body} = require("express-validator");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const {Files} = require("../models/file.model");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        var id =Math.floor((Math.random() * 99999) + 11111)+"-" + Date.now() + path.extname(file.originalname);
        cb(null, id);
    }
})
const multerCommon=multer()
const uploadProdPics = multer({storage:storage})
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
