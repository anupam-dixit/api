// var UserService = require('../services/user.services');
const {User} = require("../models/user.model");
const myLib = require("../myLib");
const {generateToken, decodeToken} = require("../myLib");
const jwt = require("jsonwebtoken");
const {Token} = require("../models/token.model");
const mongoose = require("mongoose");

const index = async (req, res, next) => {
    if (req.body._id!==undefined&&!mongoose.Types.ObjectId.isValid(req.body._id)){
        res.json(myLib.sendResponse(0, "Invalid ID Provided"))
        return
    }
    const data = await User.find(req.body).populate('permits.domains').lean().exec()
    res.json(myLib.sendResponse(1, data));
};
const vendors = async (req, res, next) => {
    let matchData={
        active:true,
        role: 'VENDOR'
    }
    let data
    if (req.body.pincode!==undefined){
        matchData.pincodes=req.body.pincode
        data = await User.aggregate([
            {
                $match: matchData
            },
            {"$addFields": {"converted_id": {"$toString": "$_id"}}},
            {
                $lookup:
                    {
                        from: 'files',
                        localField: 'converted_id',
                        foreignField: 'additional',
                        as: 'images',
                        pipeline: [
                            {$project: {is_local: 1, path: 1}}
                        ],
                    },
            },
            {
                $project:{name:1,images:1,address:1}
            }
        ]).exec()
        data.target=req.body.pincode
    }
    if (req.body.location!==undefined){
        data=await User.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates:req.body.location },
                    distanceField: 'distance',
                    spherical: true,
                    maxDistance: Number(req.body.max_distance),
                },
            },
            {
                $match: matchData
            },
            {"$addFields": {"converted_id": {"$toString": "$_id"}}},
            {
                $lookup:
                    {
                        from: 'files',
                        localField: 'converted_id',
                        foreignField: 'additional',
                        as: 'images',
                        pipeline: [
                            {$project: {is_local: 1, path: 1}}
                        ],
                    },
            },
            {
                $project:{name:1,images:1,address:1,distance:1}
            },
            {
                $sort:{distance:1}
            }
        ]).exec()
        data.target=req.body.location
    }
    if (!data||data.length===0){
        res.json(myLib.sendResponse(0, "No data found"));
        return
    }
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
                role:result.role,
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

    dataToCreate.save().then(doc=>{
        res.json(myLib.sendResponse(1))
    }).catch(err=>{
        res.json(myLib.sendResponse(0,err.toString()))
    })
};
const update = async (req, res, next) => {
    const stts=await User.updateOne({_id:req.body._id}, req.body).then((doc)=>{
        res.json(myLib.sendResponse(1))
    }).catch((err)=>{
        res.json(myLib.sendResponse(0))
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

module.exports = {index,vendors, create, update, login, logout, signup};
