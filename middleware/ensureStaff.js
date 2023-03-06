const myLib = require("../myLib");
const {Token} = require("../models/token.model");
const {User} = require("../models/user.model");
const ensureStaff = async (req, res, next) => {
    if (req.headers.token===undefined||req.headers.token===''){
        res.json(myLib.sendResponse(0, "Unauthorized"))
        return
    }
    const token_in_db = await Token.findOne({token: req.headers.token}).lean().exec();
    if (!token_in_db){
        res.json(myLib.sendResponse(0, "Token Invalid"))
        return
    }
    const token_user = await User.findById(token_in_db.user_id).lean().exec()
    if (!token_user){
        res.json(myLib.sendResponse(0, "Unable to identify token user"))
        return
    }
    if (token_user.user_type!=="s"){
        res.json(myLib.sendResponse(0, "Only Staff workers can perform this action"))
        return
    }
    // if (!token_user.active){
    //     res.json(myLib.sendResponse(0, ""))
    //     return
    // }
    next()
};
module.exports = {ensureStaff}
