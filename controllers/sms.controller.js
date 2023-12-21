// var UserService = require('../services/user.services');
const {Sms} = require("../models/sms.model");
const myLib = require("../myLib");
const https = require("https");
const {User} = require("../models/user.model");

const index = async (req, res, next) => {
    const data = await Sms.aggregate([
        {$match:req.body},
        {
            $lookup:
                {
                    from: 'users',
                    localField: 'phone',
                    foreignField: 'phone',
                    pipeline: [
                        {$project: {name: 1,phone:1,role:1}}
                    ],
                    as: 'user',
                },
        },
        {
            $sort: {
                created_by: -1,
            },
        },
    ])
    res.json(myLib.sendResponse(1, data));
};
const create = async (req, res, next) => {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
    https.get("https://smsapi.edumarcsms.com/api/v1/sendsms?apikey=cleccyys60002uptn6ul2b3jk&senderId=EDUMRC&message=" +req.body.message+ "&number=" + req.body.phone + "&templateId="+req.body.templateId, function (res_sms) {
        var body = '';
        res_sms.on('data', function (chunk) {
            body += chunk;
        });
        res_sms.on('end', function () {
            var smsResponse = JSON.parse(body);
            const dataToCreate = new Sms({
                'trans_id': smsResponse.data.transactionId,
                'phone': req.body.phone,
                'message': (req.body.type=='otp')?req.body.otp:req.body.message,
                'type': req.body.type,
                'delivery_status': smsResponse.success,
            });
            dataToCreate.save(async function (err, result) {
                if (err) {
                    res.json(myLib.sendResponse(0, err.toString()))
                    return
                } else {
                    await res.json(myLib.sendResponse(1, "Sent successfully"))
                    return
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
