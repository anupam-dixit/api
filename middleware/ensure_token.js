const myLib = require("../myLib");
const {Token} = require("../models/token.model");
const {User} = require("../models/user.model")
const {sendResponse} = require("../myLib");
exports.ensure_token = function(permittedSecondsValidity){
    return async (req, res, next) => {
        if (!req.headers._token){
            res.json(myLib.sendResponse(0, "Invalid _Token"))
            return
        }
        gapSeconds=Math.floor(new Date().getTime() / 1000)-parseInt(atob(req.headers._token))
        if (permittedSecondsValidity<gapSeconds){
            res.json(myLib.sendResponse(0, "_Token Expired"))
            return
        }
        next()
    }
}
