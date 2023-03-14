const {SubCategory} = require("../models/sub-category.model");
const myLib = require("../myLib");
const {Files} = require("../models/file.model");
const {Schema} = require("mongoose");
const mongoose = require("mongoose");
const create = async (req, res, next) => {
    const dataToCreate = new SubCategory(req.body);
    dataToCreate.save(async function (err, result) {
        if (err) {
            res.json(myLib.sendResponse(0))
            return
        } else {
            const imageToSave = new Files({
                is_local:false,
                path:req.body.ic_link,
                reference:'sub_category_img',
                additional:result._id,
            });
            imageToSave.save(async function (err2, result2) {
                if (err2) {
                    res.json(myLib.sendResponse(0))
                    return
                } else {
                    await res.json(myLib.sendResponse(1))
                }
            })
        }
    })
};
const update = async (req, res, next) => {
    categoryUpd=await SubCategory.findOneAndUpdate({_id:req.body._id}, req.body)
    if (categoryUpd){
        iconUpd=await Files.findOneAndUpdate({additional:req.body._id}, {
            path:req.body.ic_link
        })
    }
    res.json(myLib.sendResponse((categoryUpd&&iconUpd)?1:0))
};
const list = async (req, res, next) => {
    // var matchFilter={};
    // if (req.body._id!==undefined&&!mongoose.Types.ObjectId.isValid(req.body._id)){
    //     res.json(myLib.sendResponse(1, "Invalid ID provided"))
    // }
    // if (req.body._id!==undefined&&mongoose.Types.ObjectId.isValid(req.body._id)){
    //     data=await Category.aggregate([
    //         {$match:{_id:mongoose.Types.ObjectId(req.body._id)}},
    //         { "$addFields": { "converted_id": { "$toString": "$_id" }}},
    //         { $lookup:
    //                 {
    //                     from: 'files',
    //                     localField: 'converted_id',
    //                     foreignField: 'additional',
    //                     as: 'icon'
    //                 },
    //         }
    //     ]).exec()
    // }
    // else {
    //     data=await Category.aggregate([
    //         { "$addFields": { "converted_id": { "$toString": "$_id" }}},
    //         { $lookup:
    //                 {
    //                     from: 'files',
    //                     localField: 'converted_id',
    //                     foreignField: 'additional',
    //                     as: 'icon'
    //                 },
    //         }
    //     ]).exec()
    // }
    // res.json(myLib.sendResponse(1, data))
};
const remove = async (req, res, next) => {
    SubCategory.deleteOne({_id: req.params._id}, function (err, doc) {
        if (err) {
            res.json(myLib.sendResponse(0))
            return
        }
    });
    Files.deleteOne({additional: req.params._id}, function (err, doc) {
        if (err) {
            res.json(myLib.sendResponse(0))
            return
        }
    });
    res.json(myLib.sendResponse(1))
};

module.exports = {create,list,update,remove};
