const {Product} = require("../models/product.model");
const myLib = require("../myLib");
const {generateToken, decodeToken} = require("../myLib");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const {body} = require("express-validator");
const {Files} = require("../models/file.model");
const FileController = require('../controllers/file.controller');

const index = async (req, res, next) => {
    if (req.body.own !== undefined && req.body.own === '1') {
        req.body.created_by = req.headers.user_data._id
        delete req.body.own
    }
    let data
    if (req.body.simplify === '1') {
        delete req.body.simplify
        let matchData = {}
        if (req.body._id !== undefined) {
            if (req.body._id[0] !== undefined) {
                console.log(req.body._id[0])
                req.body._id = req.body._id.map(v=>mongoose.Types.ObjectId(v))
                matchData={
                    _id:{
                        $in:req.body._id
                    }
                }
            } else {
                console.log("2")
                matchData={_id:req.body._id}
            }
        }
        data = await Product.aggregate([
            {
                $match: matchData
            },
            {"$addFields": {"converted_id": {"$toString": "$_id"}}},
            {
                $lookup:
                    {
                        from: 'files',
                        localField: 'converted_id',
                        foreignField: 'additional',
                        as: 'images',
                        pipeline: [
                            {$project: {is_local: 1, path: 1}}
                        ],
                    },
            },
            {
                $lookup:
                    {
                        from: 'users',
                        localField: 'created_by',
                        foreignField: '_id',
                        as: 'vendor_details',
                        pipeline: [
                            {$project: {name: 1, address: 1}}
                        ],
                    },
            }
        ]).project({domain: 0, categ: 0, sub_categ: 0}).exec()
    } else {
        data = await Product.find(req.body).populate(['domain', 'categ', 'sub_categ'])
    }
    res.json(myLib.sendResponse(1, data));
};
const create = async (req, res, next) => {
    req.body.created_by = req.headers.user_data._id
    const dataToCreate = new Product(req.body);
    dataToCreate.save(async function (err, result) {
        if (err) {
            res.json(myLib.sendResponse(0, err))
            return
        } else {
            await res.json(myLib.sendResponse(1, "Added successfully"))
        }
    })
};
const update = async (req, res, next) => {
    const stts = await Product.updateOne({_id: req.body._id}, req.body).then((doc) => {
        res.json(myLib.sendResponse(1))
    }).catch((err) => {
        res.json(myLib.sendResponse(0))
    })
};
const remove = async (req, res, next) => {
    images = await Files.find({reference: 'product_image', additional: req.params._id}).lean().exec()
    if (images) {
        images.forEach((obj) => {
            myLib.delFile(obj.path)
            dbFileToDelete = Files.findByIdAndDelete(obj._id).lean().exec()
        });
    }
    await Product.findByIdAndDelete(req.params._id).lean().exec().then((doc) => {
        res.json(myLib.sendResponse(1))
    }).catch((e) => {
        res.json(myLib.sendResponse(0))
    })
    return
};

module.exports = {index, create, update, remove};
