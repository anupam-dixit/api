var express = require('express');
var router = express.Router();
const FileController=require('../controllers/file.controller');
const multer = require("multer");
const path = require("path");
const {validation_upload_file, validation_delete_file, validation_update_file, validation_list_file,
    validation_create_file, validation_update_file_by_id
} = require("../validation/file.validation");
const {ensureLogin} = require("../middleware/auth");
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
router.post('/',[multerCommon.none(),validation_list_file], FileController.index);
router.post('/create',[uploadProdPics.any(),validation_create_file], FileController.create);
router.post('/update',[uploadProdPics.none(),validation_update_file], FileController.update);
router.post('/update-by-id/:_id?',[uploadProdPics.none(),ensureLogin,validation_update_file_by_id], FileController.updateById);
router.post('/upload/:additional?',[uploadProdPics.any()], FileController.upload);
router.delete('/delete/:_id?',[multerCommon.none(),ensureLogin,validation_delete_file], FileController.remove);

module.exports = router;

/**
 *  {
 *     fieldname: 'test',
 *     originalname: '688304.jpg',
 *     encoding: '7bit',
 *     mimetype: 'image/jpeg',
 *     destination: 'public/images',
 *     filename: '18512-1679729388978.jpg',
 *     path: 'public\\images\\18512-1679729388978.jpg',
 *   }
 */
