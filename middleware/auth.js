const myLib = require("../myLib");
const {Token} = require("../models/token.model");
const ensureLogin = async (req, res, next) => {
    if (req.headers.token===undefined||req.headers.token===''){
        res.json(myLib.sendResponse(0, "Unauthorized"))
        return
    }
    const token_in_db = await Token.findOne({token: req.headers.token}).lean().exec();
    if (!token_in_db){
        res.json(myLib.sendResponse(0, "Token Invalid"))
        return
    }
    if ((token_in_db.expiry-Date.now())/1000<0){
        res.json(myLib.sendResponse(0, "Token Expired"))
        return
    }
    // res.json(myLib.sendResponse(0, {'expiry':token_in_db.expiry,'now':Da}))
    next()
};
module.exports = {ensureLogin}
