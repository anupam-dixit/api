const jwt = require('jsonwebtoken')
const {Token} = require("./models/token.model");
const {User} = require("./models/user.model");
const fs = require("fs");
const {RoleHasPermission} = require("./models/role-has-permission.model");
require('dotenv').config();

function sendResponse(responseType, data = (responseType == 1) ? "Action performed successfully" : "Unable to perform this action") {
    return {status: (responseType === 1), response: data}
}
function generateToken(userId) {
    var finalRes;
    var jwt_token = jwt.sign(
        {user_id: userId}, process.env.TOKEN_ENC, {expiresIn: Date.now() + (86400000 * 7)}
    );
    var tokenEntry = new Token({
        token: jwt_token,
        user_id: userId,
    })
    tokenEntry.save(async function (err, result) {
        if (err) {
            finalRes = 'false'
        } else {
            finalRes = result
        }
    })
    return jwt_token
}
function decodeToken(tokenToBeDecrypted, userData = false) {
    decodedToken = jwt.verify(tokenToBeDecrypted, process.env.TOKEN_ENC)
    decodedToken.user = User.findOne({phone: '8737025071'}).lean().exec()
    return decodedToken
}
function delFile(path) {
    fs.unlink(path, function (err) {
        return !err;
    });
}
function randomString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function pricer(MRP,priceModSign,priceModType,priceModAmount){
    let result
    priceModAmount=parseFloat(priceModAmount)
    MRP=parseFloat(MRP)
    if(priceModSign==="-"){
        if (priceModType==='n'){
            result=MRP-priceModAmount
        }
        if (priceModType==='%'){
            result=MRP-(MRP*priceModAmount/100)
        }
    }
    if(priceModSign==="+"){
        if (priceModType==='n'){
            result=MRP+priceModAmount
        }
        if (priceModType==='%'){
            result=MRP+(MRP*priceModAmount/100)
        }
    }
    return result
}

async function hasPermission(role, permissionToCheck) {
    let answer = false
    let roleHasPerms = await RoleHasPermission.findOne({role: role}).lean().exec()
    answer = roleHasPerms.permission.includes(permissionToCheck)
    return answer
}
module.exports = {sendResponse, generateToken, decodeToken, delFile, randomString, pricer,hasPermission}
