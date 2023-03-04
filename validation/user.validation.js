
const myLib = require("../myLib");
const {User} = require("../models/user.model");
const validation_create_user = async (req, res, next) => {
    if (req.body.name===undefined||req.body.name.length<3){
        res.json(myLib.sendResponse(0, "Name too short"))
        return
    }
    if (req.body.phone===undefined||req.body.phone.length!==10){
        res.json(myLib.sendResponse(0, "Phone number only 10 digits permitted"))
        return
    }
    var user_by_phone = await User.find({phone: req.body.phone}).lean().exec()
    if (user_by_phone.length){
        res.json(myLib.sendResponse(0, "Phone number already registered"))
        return
    }
    if (req.body.password===undefined||req.body.password.length<3){
        res.json(myLib.sendResponse(0, "Password is can not be too short"))
        return
    }
    if (req.body.email!==undefined){
        if (!req.body.email.includes("@")||!req.body.email.includes(".")){
            res.json(myLib.sendResponse(0, "Invalid Email"))
            return
        }
        var user_by_email = await User.find({phone: req.body.phone}).lean().exec()
        if (user_by_email.length){
            res.json(myLib.sendResponse(0, "Email already registered"))
            return
        }
    }
    next()
};
module.exports = {validation_create_user}
