// var FilesService = require('../services/Files.services');
const {Files} = require("../models/file.model");
const myLib = require("../myLib");

const index = async (req, res, next) => {
    const data = await Files.find(req.body) // .exec() returns a true Promise
    res.json({data});
};

const create =  (req, res, next) => {
    const dataToCreate = new Files(req.body);
    dataToCreate.save(async function (err, result) {
        if (err) {
            await res.json(myLib.sendResponse(0,err))
        } else {
            await res.json(myLib.sendResponse(1,"Created successfully"))
        }
    })
};

module.exports = {index, create};
