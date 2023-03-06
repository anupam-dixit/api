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
module.exports = {validation_create_invitation}
