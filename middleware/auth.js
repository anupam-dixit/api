const myLib = require("../myLib");
const {Token} = require("../models/token.model");
const {User} = require("../models/user.model");
const {decodeToken} = require("../myLib");
const moment = require("moment");
const {now} = require("moment");
const ensureLogin = async (req, res, next) => {
    if (req.headers.token===undefined||req.headers.token===''){
        res.status(401).json(myLib.sendResponse(0, "Unauthorized"))
        return
    }
    const token_in_db = await Token.findOne({token: req.headers.token}).lean().exec();
    if (!token_in_db){
        res.status(401).json(myLib.sendResponse(0, "Token Invalid"))
        return
    }
    // if (token_in_db.expiry < Date.now()) {
    //     // res.json(myLib.sendResponse(0, {'now':moment(Date.now()).format('MM/DD/YYYY HH:mm'),'expiry':moment(token_in_db.expiry).format('MM/DD/YYYY HH:mm')}))
    //     // res.json(myLib.sendResponse(0, decodeToken(req.headers.token)))
    //     res.json(myLib.sendResponse(0,moment(decodeToken(req.headers.token).exp).format('MM/DD/YYYY HH:mm')))
    //     return
    // }
    var auth_user_data = await User.findOne({_id: token_in_db.user_id}).lean().exec();
    if (!auth_user_data){
        res.json(myLib.sendResponse(0, "User not found UNauthenticated"))
        return
    }
    req.headers.user_data=auth_user_data
    // res.json(myLib.sendResponse(0, {'expiry':token_in_db.expiry,'now':Da}))
    next()
};
module.exports = {ensureLogin}
