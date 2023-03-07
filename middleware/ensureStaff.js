const myLib = require("../myLib");
const {Token} = require("../models/token.model");
const {User} = require("../models/user.model");
const ensureStaff = async (req, res, next) => {

    if (req.headers.user_data.user_type!=="s"){
        res.json(myLib.sendResponse(0, "Only Staff workers can perform this action"))
        return
    }
    if (!req.headers.user_data.active){
        res.json(myLib.sendResponse(0, "Your account is not active"))
        return
    }
    next()
};
module.exports = {ensureStaff}
