// var UserService = require('../services/user.services');
const {Invite} = require("../models/invite.model");
const myLib = require("../myLib");
const {decodeToken} = require("../myLib");

const create = async (req, res, next) => {
    req.body.created_by=req.headers.user_data._id
    const dataToCreate = new Invite(req.body);
    dataToCreate.save(async function (err, result) {
        if (err) {
            res.json(myLib.sendResponse(0, err))
            return
        } else {
            await res.json(myLib.sendResponse(1, {message:'Invited successfully',invitation:result._id}))
        }
    })
};
const list = async (req, res, next) => {
    var data;
    if (req.headers.user_data.user_type==="sa"){
        data = await Invite.find()
    } else {
        data = await Invite.find({created_by:req.headers.user_data._id})
    }
    res.json(myLib.sendResponse(1, data))
};

module.exports = {create,list};
