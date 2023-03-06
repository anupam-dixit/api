// var UserService = require('../services/user.services');
const {Invite} = require("../models/invite.model");
const myLib = require("../myLib");
const {decodeToken} = require("../myLib");

const create = async (req, res, next) => {
    req.body.created_by=decodeToken(req.headers.token).user_id
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

module.exports = {create};
