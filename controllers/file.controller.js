// var FilesService = require('../services/Files.services');
const {Files} = require("../models/file.model");
const myLib = require("../myLib");
const path = require("path");
const {body} = require("express-validator");
const fs = require("fs");
const cloudinary = require('cloudinary').v2;
// Configuration
cloudinary.config({
    cloud_name: "deoy7jghp",
    api_key: "177664842278386",
    api_secret: "ZdF2sut0XaAVOjLCQgRQwHBpA_s"
});
const index = async (req, res, next) => {
    const data = await Files.find(req.body) // .exec() returns a true Promise
    res.json({data});
};

const create = (req, res, next) => {
    const dataToCreate = new Files(req.body);
    dataToCreate.save(async function (err, result) {
        if (err) {
            await res.json(myLib.sendResponse(0, err))
        } else {
            await res.json(myLib.sendResponse(1, "Created successfully"))
        }
    })
};
const upload = (req, res, next) => {
    if (!res.req.hasOwnProperty('files')){
        res.json(myLib.sendResponse(0,"No files to upload"))
    } else {
        // console.log(req.files)
    }
    if (req.params.additional === undefined) {
        res.json(myLib.sendResponse(0, "Additional field is required"))
        res.req.files.forEach((obj) => {
            myLib.delFile("E:\\pitesh\\Angular\\api\\public\\images\\" + obj.filename)
        });
        return
    }
    let dataToCreate = []
    res.req.files.forEach((obj) => {
        dataToCreate.push({
            is_local: true,
            path: obj.path,
            reference: "product_image",
            additional: req.params.additional
        })
    });
    Files.insertMany(dataToCreate, function (error, docs) {
        if (error) {
            res.json(myLib.sendResponse(0,error))
        } else {
            res.json(myLib.sendResponse(1))
        }
    });
};

module.exports = {index, create, upload};
