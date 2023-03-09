const myLib = require("../myLib");
const {Invite} = require("../models/invite.model");
const {User} = require("../models/user.model");
const validation_create_invitation = async (req, res, next) => {
    if (req.body.entity_name===undefined||req.body.entity_name.length<3){
        res.json(myLib.sendResponse(0, "Provide Shop or Shopkeeper name"))
        return
    }
    if (req.body.phone===undefined||req.body.phone.length!==10){
        res.json(myLib.sendResponse(0, "Provide 10 digits phone number to invite"))
        return
    }
    const user = await User.findOne({phone :req.body.phone}).lean().exec()
    if (user){
        res.json(myLib.sendResponse(0, "This phone number already in use"))
        return
    }
    next()
};
const validation_accept_invitation = async (req, res, next) => {
    const invitation_key = await Invite.findOne({_id :req.body.invitation_key}).lean().exec()
    if (!invitation_key){
        res.json(myLib.sendResponse(0, "Invalid Invitation Key"))
        return
    }
    if (invitation_key.active===false){
        res.json(myLib.sendResponse(0, "Expired invitation key"))
        return
    }
    if (invitation_key.phone!=req.body.phone){
        res.json(myLib.sendResponse(0, "Invitation key mismatching with phone"))
        return
    }
    if (req.body.entity_name===undefined||req.body.entity_name.length<3){
        res.json(myLib.sendResponse(0, "Provide Shop or Shopkeeper name"))
        return
    }
    if (req.body.phone===undefined||req.body.phone.length!==10){
        res.json(myLib.sendResponse(0, "Provide 10 digits phone number to invite"))
        return
    }
    if (req.body.password===undefined||req.body.password.length<3){
        res.json(myLib.sendResponse(0, "Please choose a secure password"))
        return
    }
    if (req.body.pincodes===undefined||req.body.pincodes.length<4){
        res.json(myLib.sendResponse(0, "At least one pincode is required"))
        return
    }
    const user = await User.findOne({phone :req.body.phone}).lean().exec()
    if (user){
        res.json(myLib.sendResponse(0, "This phone number already in use"))
        return
    }
    next()
};
module.exports = {validation_create_invitation,validation_accept_invitation}
