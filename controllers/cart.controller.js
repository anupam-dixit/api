const {Cart} = require("../models/cart.model");
const myLib = require("../myLib");
const create = async (req, res, next) => {
    // const dataToCreate = new Domain(req.body);
    // dataToCreate.save(async function (err, result) {
    //     if (err) {
    //         res.json(myLib.sendResponse(0))
    //         return
    //     } else {
    //         await res.json(myLib.sendResponse(1))
    //     }
    // })
};
const update = async (req, res, next) => {
    // Domain.findOneAndUpdate({_id:req.body._id}, req.body, {upsert: false}, function(err, doc) {
    //     if (err){
    //         res.json(myLib.sendResponse(0))
    //     }
    //     res.json(myLib.sendResponse(1))
    // });
};
const list = async (req, res, next) => {
    // var data=await Domain.find(req.body).lean().exec()
    res.json(myLib.sendResponse(1, req.body))
};
const remove = async (req, res, next) => {
    // Domain.findByIdAndDelete(req.body._id, function (err, doc) {
    //     if (err) res.json(myLib.sendResponse(0))
    //     else res.json(myLib.sendResponse(1))
    // });
};

module.exports = {create,list,update,remove};
