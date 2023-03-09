// var UserService = require('../services/user.services');
const {User} = require("../models/user.model");
const myLib = require("../myLib");
const {generateToken, decodeToken} = require("../myLib");
const jwt = require("jsonwebtoken");
const {Token} = require("../models/token.model");

const index = async (req, res, next) => {
    var requester=await User.find({_id:decodeToken(req.headers.token).user_id}).lean().exec()
    const data = await User.find(req.body).lean().exec()
    res.json(myLib.sendResponse(1, data));
};
const signup =  async (req, res, next) => {
    var data;
    data = await User.find({'phone': req.body.phone}).lean().exec();
    if (Object.keys(data).length !== 0) {
        res.json(myLib.sendResponse(0, "This phone number is already registered"))
        return
    }
    if (req.body.email !== undefined && req.body.email.length > 2) {
        data = await User.find({'email': req.body.email}).lean().exec();
        if (Object.keys(data).length !== 0) {
            res.json(myLib.sendResponse(0, "This email is already registered"))
            return
        }
    }
    const dataToCreate = new User(req.body);
    dataToCreate.save(async function (err, result) {
        if (err) {
            res.json(myLib.sendResponse(0, err))
        } else {
            var userDataToSend={
                _id:result._id,
                name:result.name,
                phone:result.phone,
                email:result.email,
                pincodes:result.pincodes,
                user_type:result.user_type,
                created_at:result.created_at,
            }
            await res.json(myLib.sendResponse(1, {user:userDataToSend,token:generateToken(result._id)}))
        }
    })
};
const create = async (req, res, next) => {
    var verified=[]
    if (req.body.phone!==undefined){
        verified.push("phone")
    }
    if (req.body.email!==undefined){
        verified.push("email")
    }
    if (verified.length>0){
        req.body.verified=verified
    }
    req.body.created_by=decodeToken(req.headers.token).user_id
    const dataToCreate = new User(req.body);

    dataToCreate.save(async function (err, result) {
        if (err) {
            res.json(myLib.sendResponse(0, err))
            return
        } else {
            await res.json(myLib.sendResponse(1, "Added successfully"))
        }
    })
};
const login = async (req, res, next) => {
    if (req.body.phone.length!=10){
        res.json(myLib.sendResponse(0, "Provide 10 digit phone number"))
        return
    }
    if (req.body.password==undefined||req.body.password.length<1){
        res.json(myLib.sendResponse(0, "Provide password"))
        return
    }
    const user = await User.findOne({phone :req.body.phone,password:req.body.password}).lean().exec(); // .exec() returns a true Promise
    if (!user){
        res.json(myLib.sendResponse(0, "Incorrect credentials"))
        return
    }
    if (user.active===false){
        res.json(myLib.sendResponse(0, "Your account is under review please try again after some time"))
        return
    }
    res.json(myLib.sendResponse(1, {user:user,token:myLib.generateToken(user._id)}))
};
const logout = async (req, res, next) => {
    if (req.body.token==undefined||req.body.token==''){
        res.json(myLib.sendResponse(0, "Provide token pls"))
        return
    }
    const token_in_db = await Token.findOne({token: req.body.token, active:true}).lean().exec();
    if(!token_in_db){
        res.json(myLib.sendResponse(0, "Invalid token"))
        return
    }
    stts=await Token.updateOne({'_id':token_in_db._id},{'active':false,'updated_at':Date.now()})
    if(stts.modifiedCount!='1'){
        await res.json(myLib.sendResponse(0))
        return
    }
    res.json(myLib.sendResponse(1))
};
const demo = async (req, res, next) => {
    res.json(myLib.sendResponse(0, decodeToken(req.body.token,true)))
}

module.exports = {index, create, login, logout, demo, signup};
