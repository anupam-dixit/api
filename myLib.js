const jwt = require('jsonwebtoken')
const {Token} = require("./models/token.model");
const {token} = require("morgan");
const res = require("express/lib/response");
require('dotenv').config();

function sendResponse(responseType, data=(responseType==1) ? "Action performed successfully" : "Unable to perform this action") {
    return {status: (responseType === 1), response: data}
}

function generateToken(userId) {
    var finalRes;
    var jwt_token = jwt.sign(
        {user_id: userId},
        process.env.TOKEN_ENC,
        {expiresIn: process.env.TOKEN_EXPIRY}
    );
    var tokenEntry = new Token({
        token: jwt_token,
        user_id: userId,
        expiry: new Date(Date.now() + parseInt(process.env.TOKEN_EXPIRY))
    })
    tokenEntry.save(async function (err, result) {
        if (err) {
            finalRes = 'false'
        } else {
            finalRes=result
        }
    })
    return jwt_token
}

function decodeToken(tokenToBeDecrypted) {
    return decodedToken = jwt.verify(tokenToBeDecrypted, process.env.TOKEN_ENC)

    // res.status(200).json({success:true, data:{userId:decodedToken.userId,
    //         email:decodedToken.email});
}

module.exports = {sendResponse, generateToken, decodeToken}
