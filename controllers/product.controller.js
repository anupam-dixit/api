const {Product} = require("../models/product.model");
const myLib = require("../myLib");
const {generateToken, decodeToken} = require("../myLib");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const {body} = require("express-validator");
const index = async (req, res, next) => {
    if (req.body._id!==undefined&&!mongoose.Types.ObjectId.isValid(req.body._id)){
        res.json(myLib.sendResponse(0, "Invalid ID Provided"))
        return
    }
    if (req.body.own!==undefined&&req.body.own==='1'){
        req.body.created_by=req.headers.user_data._id
    }
    const data = await Product.find(req.body).populate(['domain','categ','sub_categ'])
    res.json(myLib.sendResponse(1, data));
};
const create = async (req, res, next) => {
    req.body.created_by=req.headers.user_data._id
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
    const stts=await Product.updateOne({_id:req.body._id}, req.body).then((doc)=>{
        res.json(myLib.sendResponse(1))
    }).catch((err)=>{
        res.json(myLib.sendResponse(0))
    })
};
const demo = async (req, res, next) => {
    console.log(res.req.files)
    res.json(myLib.sendResponse(0))
};


module.exports = {index, create, update,demo};
