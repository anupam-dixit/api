const {Subscription} = require("../models/subscription.model");
const {sendResponse} = require("../myLib");
const {SubscriptionMember} = require("../models/subscription-member.model");
const {Files} = require("../models/file.model");
const create = async (req, res, next) => {
    const dataToCreate = new Subscription(req.body);
    dataToCreate.save(async function (err, result) {
        if (err) {
            res.json(sendResponse(0))
            return
        } else {
            await res.json(sendResponse(1, {message: "Created Successfully", _id: result._id}))
            return
        }
    })
};
const update = async (req, res, next) => {
    Subscription.findOneAndUpdate({_id: req.body._id}, req.body, {upsert: false}, function (err, doc) {
        if (err) {
            res.json(sendResponse(0))
        }
        res.json(sendResponse(1, {message: "Created Successfully", _id: doc._id}))
    });
};
const list = async (req, res, next) => {
    // var data=await Subscription.find(req.body).sort({level:1}).lean().exec()
    var data = await Subscription.aggregate([
        {$addFields: {'id': {"$toString": "$_id"}}},
        {
            $lookup: {
                from: 'files',
                localField: 'id',
                foreignField: 'additional',
                as: 'images'
            }
        },
        {$match: req.body},
    ])
    res.json(sendResponse(1, data))
};
const apply = async (req, res, next) => {
    let subsacriptionData=await Subscription.findById(req.body.subscription_id).lean().exec()
    const dataToCreate = new SubscriptionMember({
        subscription_id:req.body.subscription_id,
        price:subsacriptionData.price,
        created_by:req.headers.user_data._id,
    });
    dataToCreate.save(async function (err, result) {
        if (err) {
            res.json(sendResponse(0))
            return
        } else {
            await res.json(sendResponse(1))
            return
        }
    })
};
const membersList = async (req, res, next) => {
    // var data = await SubscriptionMember.find(req.body).populate('subscription_id').populate('created_by','name').lean().exec()
    var data = await SubscriptionMember.aggregate([
        {
            $match:req.body
        },
        {
            $lookup:{
                from: 'users',
                localField: 'created_by',
                foreignField: '_id',
                pipeline:[
                    {$project:{name:1}}
                ],
                as: 'subscriber'
            }
        },
        {
            $lookup:{
                from: 'subscriptions',
                localField: 'subscription_id',
                foreignField: '_id',
                as: 'subscription'
            }
        },
    ])
    res.json(sendResponse(1, data))
};
const mySubscription = async (req, res, next) => {
    var data = await SubscriptionMember.find({
        $and: [
            {
                'validity.end': {
                    $gte: new Date()
                }
            },
            {
                'status': 'ACTIVE'
            },
            {
                created_by: req.headers.user_data._id
            }
        ]
    }).populate('subscription_id','title').sort({created_at:-1}).limit(1).lean().exec()
    if (data.length===0){
        res.json(sendResponse(0, "No subscription found"))
        return
    }
    res.json(sendResponse(1, data))
};
const membershipUpdate = async (req, res, next) => {
    SubscriptionMember.findOneAndUpdate({_id: req.body._id}, req.body, {upsert: false}, function (err, doc) {
        if (err) {
            res.json(sendResponse(0))
            return
        } if (doc){
            if (doc.status==='ACTIVE'){
                // If assigning new membership then disbale previous
                SubscriptionMember.updateMany({$and:[{created_by:doc.created_by},{_id:{$ne:doc._id}},{status:'ACTIVE'}]},{status:'OFF'}).then(doc2=>{
                    res.json(sendResponse(1))
                    return
                }).catch(err2=>{
                    res.json(sendResponse(0))
                    return
                })
            } else {
                res.json(sendResponse(1))
                return
            }
        }
    })
};
const remove = async (req, res, next) => {
    Subscription.findByIdAndDelete(req.params._id, function (err, doc) {
        if (err) res.json(sendResponse(0))
        else {
            Files.find({additional: doc._id}).deleteMany().then(doc2 => {
                res.json(sendResponse(1))
                return
            })
        }
    });
};

module.exports = {create, apply, list, mySubscription,membershipUpdate, membersList, update, remove};
