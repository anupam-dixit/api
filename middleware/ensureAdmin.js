const myLib = require("../myLib");
const {Token} = require("../models/token.model");
const {User} = require("../models/user.model");
const ensureAdmin = async (req, res, next) => {
    if (req.headers.user_data.user_type!=="sa"){
        res.json(myLib.sendResponse(0, "Only Super Admin can perform this action"))
        return
    }
    next()
};
module.exports = {ensureAdmin}
