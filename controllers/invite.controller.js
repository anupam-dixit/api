// var UserService = require('../services/user.services');
const {Invite} = require("../models/invite.model");
const myLib = require("../myLib");
const {decodeToken} = require("../myLib");
const {User} = require("../models/user.model");
const mongoose = require("mongoose");

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
    if (await myLib.hasPermission(req.headers.user_data.role, "INVITE_VIEW_ALL")){
        data = await Invite.find().lean().exec()
    } if (await myLib.hasPermission(req.headers.user_data.role, "INVITE_VIEW_SELF")){
        // data = await Invite.find({created_by:req.headers.user_data._id})
        data = await Invite.find({created_by:req.headers.user_data._id}).populate('accepted_by').lean().exec()
    }
    res.json(myLib.sendResponse(1, data))
};
const verify = async (req, res, next) => {
    var data;
    if (req.body.invitation_key===undefined||req.body.invitation_key.length<3||mongoose.Types.ObjectId.isValid(req.body.invitation_key)===false){
        res.json(myLib.sendResponse(0, "incorrect invitation key"))
        return
    }
    let invitation_key_in_db = await Invite.findOne({_id:req.body.invitation_key}).lean().exec()
    if (!invitation_key_in_db){
        res.json(myLib.sendResponse(0, "Invalid invitation key"))
        return
    }
    if (invitation_key_in_db.active===false){
        res.json(myLib.sendResponse(0, "This invitation has been expired. Please request new one."))
        return
    }
    res.json(myLib.sendResponse(1, {'entity_name':invitation_key_in_db.entity_name,'phone':invitation_key_in_db.phone,'address'
:invitation_key_in_db.address,location:invitation_key_in_db.location.coordinates}))
};
const accept = async (req, res, next) => {
    var verified=[]
    if (req.body.phone!==undefined){
        verified.push("phone")
    }

    req.body.role='VENDOR'
    req.body.verified=verified
    req.body.active=false
    req.body.name=req.body.entity_name

    const dataToCreate = new User(req.body);

    dataToCreate.save(async function (err, result) {
        if (err) {
            res.json(myLib.sendResponse(0, err))
            return
        } else {
            Invite.findOne({_id:req.body.invitation_key}).then((invitation)=>{
                invitation.active=false
                invitation.accepted_by=result._id
                return invitation.save()
            }).catch((err=>{
                return false
            }))
            await res.json(myLib.sendResponse(1, "Added successfully"))
        }
    })
};

module.exports = {create,list,verify,accept};
