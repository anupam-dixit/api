// var UserService = require('../services/user.services');
const {Sms} = require("../models/sms.model");
const myLib = require("../myLib");
const https = require("https");
const {User} = require("../models/user.model");

const index = async (req, res, next) => {
    const data = await Sms.find().lean().exec(); // .exec() returns a true Promise
    res.json(myLib.sendResponse(1, data));
};
const create = async (req, res, next) => {
    var otp = Math.floor(Math.random() * 99999)
    https.get("https://smsapi.edumarcsms.com/api/v1/sendsms?apikey=cleccyys60002uptn6ul2b3jk&senderId=EDUMRC&message=Your sms (Powered by Edumarc Technologies) OTP for verification is: " + otp + ". Code is valid for 2 minutes. OTP is confidential, refrain from sharing it with anyone.&number=" + req.body.phone + "&templateId=1707167291733893032", function (res_sms) {
        var body = '';
        res_sms.on('data', function (chunk) {
            body += chunk;
        });
        res_sms.on('end', function () {
            var smsResponse = JSON.parse(body);
            // console.log(":::"+JSON.stringify(smsResponse));
            const dataToCreate = new Sms({
                'trans_id': smsResponse.data.transactionId,
                'phone': req.body.phone,
                'message': otp,
                'type': 'otp',
                'delivery_status': smsResponse.success,
            });
            dataToCreate.save(async function (err, result) {
                if (err) {
                    res.json(myLib.sendResponse(0, err))
                } else {
                    await res.json(myLib.sendResponse(1, "Sent successfully"))
                }
            })
        });
    }).on('error', function (e) {
        res.json(myLib.sendResponse(0, e))
    });

};
const verify = async (req, res, next) => {
    if (req.body.phone === undefined || req.body.phone.toString().length !== 10) {
        res.json(myLib.sendResponse(0, "Please check your phone number"))
        return
    }
    if (req.body.otp === undefined || req.body.phone.otp < 4) {
        res.json(myLib.sendResponse(0, "Please check your otp"))
        return
    }
    var sms = await Sms.find({
        'type': 'otp',
        'phone': req.body.phone,
        'otp': req.body.otp,
        'active': true
    }).sort({'created_at': -1}).limit(1).lean()
    if (sms.length===0) {
        res.json(myLib.sendResponse(0, "OTP not found"))
        return
    }
    if (sms[0].message != req.body.otp) {
        res.json(myLib.sendResponse(0, "Invalid OTP"))
        return
    }
    await Sms.updateOne({'_id':sms[0]._id},{'active':false,'updated_at':Date.now()})
    await User.updateOne({'phone':sms[0].phone},{"$push": { "verified": 'phone' },'updated_at':Date.now()})
    res.json(myLib.sendResponse(1, "Verified"))
};

module.exports = {index, create,verify};
