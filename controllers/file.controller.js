// var FilesService = require('../services/Files.services');
const {Files} = require("../models/file.model");
const myLib = require("../myLib");
const path = require("path");
const fs = require("fs");
const e = require("express");
const {sendResponse} = require("../myLib");
const cloudinary = require('cloudinary').v2;
// Configuration
cloudinary.config({
    cloud_name: "sidhaulionline",
    api_key: "177664842278386",
    api_secret: "ZdF2sut0XaAVOjLCQgRQwHBpA_s"
});
const index = async (req, res, next) => {
    const data = await Files.find(req.body).populate({path:'created_by',select:'name'})
    res.json(myLib.sendResponse(1,data));
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
const update = (req, res, next) => {
    const dataToCreate = Files.updateMany({additional: req.body.additional},req.body,{upsert: true}).then(doc=>{
        res.json(sendResponse(1))
        return
    }).catch(err=>{
        res.json(sendResponse(0,err.toString()))
        return
    })
};
const updateById = (req, res, next) => {
    const dataToCreate = Files.findByIdAndUpdate(req.params._id,req.body).then(doc=>{
        res.json(sendResponse(1))
        return
    }).catch(err=>{
        res.json(sendResponse(0))
        return
    })
};
const upload = (req, res, next) => {
    if (!res.req.hasOwnProperty('files')){
        res.json(myLib.sendResponse(0,"No files to upload"))
        return;
    }
    if (req.body.reference === undefined) {
        res.json(myLib.sendResponse(0, "Reference field is required"))
        res.req.files.forEach((obj) => {
            myLib.delFile("public/images/" + obj.filename)
        });
        return
    }
    if (req.params.additional === undefined) {
        res.json(myLib.sendResponse(0, "Additional field is required"))
        res.req.files.forEach((obj) => {
            myLib.delFile("public/images/" + obj.filename)
        });
        return
    }
    let dataToCreate = []
    res.req.files.forEach((obj) => {
        dataToCreate.push({
            is_local: true,
            path: obj.path,
            reference: req.body.reference,
            additional: req.params.additional,
            created_by:req.body.created_by
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

const remove = async (req, res, next) => {
    await Files.findByIdAndDelete(req.params._id).then((doc)=>{
        myLib.delFile(doc.path)
        res.json(myLib.sendResponse(1))
    }).catch((e)=>{
        res.json(myLib.sendResponse(0))
    })
};

module.exports = {index, create,update,updateById, upload, remove};
