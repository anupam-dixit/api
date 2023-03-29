const myLib = require("../myLib");
const {Invite} = require("../models/invite.model");
const {User} = require("../models/user.model");
const {body} = require("express-validator");
const multer = require("multer");
const path = require("path");
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
module.exports = {validation_upload_file}
