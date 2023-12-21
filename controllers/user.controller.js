// var UserService = require('../services/user.services');
const {User} = require("../models/user.model");
const myLib = require("../myLib");
const {generateToken, decodeToken, sendResponse} = require("../myLib");
const jwt = require("jsonwebtoken");
const {Token} = require("../models/token.model");
const mongoose = require("mongoose");
const {Product} = require("../models/product.model");
const {now} = require("mongoose");
const {Order} = require("../models/order.model");
const {FileOrder} = require("../models/file-order.model");
const {Invite} = require("../models/invite.model");
const {Visit} = require("../models/visit.model");

const index = async (req, res, next) => {
    if (req.body._id!==undefined&&!mongoose.Types.ObjectId.isValid(req.body._id)){
        res.json(myLib.sendResponse(0, "Invalid ID Provided"))
        return
    }
    const data = await User.find(req.body).populate('permits.domains').lean().exec()
    res.json(myLib.sendResponse(1, data));
};
let vendors = async (req, res, next) => {
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
const vendorsByProdSearchByLocation = async (req, res, next) => {
    let matchData={active:{vendor:true,admin:true}}
    if (req.body.search!==undefined){
        matchData.$text= {$search: req.body.search}
    }
    let data=await Product.aggregate([
        {$match: matchData},
        { $project: { created_by: 1 } }
    ])
    allVendorIds=data.map(obj=>{
        return obj.created_by
    })
    uniqueVendorIds = [...new Set(allVendorIds)].map(obj=>{
        return mongoose.Types.ObjectId(obj)
    })

    let vendors= await User.aggregate([
        {
            $geoNear: {
                near: { type: 'Point', coordinates:req.body.location },
                distanceField: 'distance',
                spherical: true,
                maxDistance: parseInt(req.body.max_distance),
            },
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
                        {$project: {is_local: 1, path: 1,reference:1}}
                    ],
                },
        },
        {
            $lookup:
                {
                    from: 'subscriptionmembers',
                    localField: '_id',
                    foreignField: 'created_by',
                    as: 'subscription',
                    pipeline: [
                        {
                            $match: {
                                $and:[
                                    {'status': 'ACTIVE'},
                                    {'validity.end': {$gte:now()}}
                                ]
                            }
                        },
                        {
                            $lookup:
                                {
                                    from: 'subscriptions',
                                    localField: 'subscription_id',
                                    foreignField: '_id',
                                    as: 'subscription_info',
                                },
                        },
                        {$addFields:{str_subscription_id:{$toString:'$subscription_id'}}},
                        {
                            $lookup:
                                {
                                    from: 'files',
                                    localField: 'str_subscription_id',
                                    foreignField: 'additional',
                                    as: 'subscription_img',
                                },
                        },
                    ]
                },
        },
        {
            $project:{
                password:0,verified:0,permits:0,created_at:0,updated_at:0
            }
        },
        {
            $sort:{distance:1}
        },
        {
            $match: {
                _id: {$in: uniqueVendorIds},
                active:true
            }
        },
    ]).exec()

    res.json(myLib.sendResponse(1,vendors));
}
const vendorsByProdSearchByPincode = async (req, res, next) => {
    let matchData={active:{vendor:true,admin:true}}
    if (req.body.search!==undefined){
        matchData.$text= {$search: req.body.search}
    }
    let data=await Product.aggregate([
        {$match: matchData},
        { $project: { created_by: 1 } }
    ])
    allVendorIds=data.map(obj=>{
        return obj.created_by
    })
    uniqueVendorIds = [...new Set(allVendorIds)].map(obj=>{
        return mongoose.Types.ObjectId(obj)
    })
    let vendors= await User.aggregate([
        {"$addFields": {"converted_id": {"$toString": "$_id"}}},
        {
            $lookup:
                {
                    from: 'files',
                    localField: 'converted_id',
                    foreignField: 'additional',
                    as: 'images',
                    pipeline: [
                        {$project: {is_local: 1, path: 1,reference:1}}
                    ],
                },
        },
        {
            $lookup:
                {
                    from: 'subscriptionmembers',
                    localField: '_id',
                    foreignField: 'created_by',
                    as: 'subscription',
                    pipeline: [
                        {
                            $match: {
                                $and:[
                                    {'status': 'ACTIVE'},
                                    {'validity.end': {$gte:now()}}
                                ]
                            }
                        },
                        {
                            $lookup:
                                {
                                    from: 'subscriptions',
                                    localField: 'subscription_id',
                                    foreignField: '_id',
                                    as: 'subscription_info',
                                },
                        },
                        {$addFields:{str_subscription_id:{$toString:'$subscription_id'}}},
                        {
                            $lookup:
                                {
                                    from: 'files',
                                    localField: 'str_subscription_id',
                                    foreignField: 'additional',
                                    as: 'subscription_img',
                                },
                        },
                    ]
                },
        },
        {
            $project:{
                password:0,verified:0,permits:0,created_at:0,updated_at:0
            }
        },
        {
            $match: {
                _id: {$in: uniqueVendorIds},
                pincodes:req.body.pincode,
                active:true
            }
        },
    ]).exec()
    res.json(myLib.sendResponse(1,vendors));
}
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
const updateByPhone = async (req, res, next) => {
    const stts=await User.updateOne({phone:req.body.phone}, req.body).then((doc)=>{
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
const dashboardDataAdmin = async (req, res, next) => {
    let result={}
    result.numUsers=await User.countDocuments()
    result.numOrders=(await Order.distinct('order_id').lean().exec()).length+(await FileOrder.distinct('order_id').lean().exec()).length
    result.numInvite=await Invite.countDocuments()
    result.numProds=await Product.countDocuments()
    result.numVisits=await Visit.countDocuments()

    let date=new Date()
    let arrVendorConversion=[['Month','New Customer','Invited','Created']]
    for (i = 0; i <= date.getMonth(); i++) {
        curCustomers=await User.find({
            created_at: {
                $gte: new Date(date.getFullYear(), i, 1), // Start of the month
                $lt: new Date(date.getFullYear(), i+1, 1), // Start of the next month
            },role:'CUSTOMER'
        }).countDocuments()
        curVendorsInvited=await Invite.find({
            created_at: {
                $gte: new Date(date.getFullYear(), i, 1), // Start of the month
                $lt: new Date(date.getFullYear(), i+1, 1), // Start of the next month
            },
        }).countDocuments()
        curVendorsCreated=await User.find({
            created_at: {
                $gte: new Date(date.getFullYear(), i, 1), // Start of the month
                $lt: new Date(date.getFullYear(), i+1, 1), // Start of the next month
            },
            role:'VENDOR'
        }).countDocuments()
        arrVendorConversion.push([
            new Date(date.getFullYear(), i).toLocaleString('default', { month: 'long' }),
            curCustomers,
            curVendorsInvited,
            curVendorsCreated
        ])
    }
    result.vendorConversiuonChart=arrVendorConversion

    let arrOrderChart=[['Month','Common Order','File Order']]
    for (i = 0; i <= date.getMonth(); i++) {
        curOrds=await Order.find({
            created_at: {
                $gte: new Date(date.getFullYear(), i, 1), // Start of the month
                $lt: new Date(date.getFullYear(), i+1, 1), // Start of the next month
            },
        }).distinct('order_id').lean().exec()
        curFileOrds=await FileOrder.find({
            created_at: {
                $gte: new Date(date.getFullYear(), i, 1), // Start of the month
                $lt: new Date(date.getFullYear(), i+1, 1), // Start of the next month
            },
        }).distinct('order_id').lean().exec()
        arrOrderChart.push([
            new Date(date.getFullYear(), i).toLocaleString('default', { month: 'long' }),
            curOrds.length,
            curFileOrds.length
        ])
    }
    result.orderChart=arrOrderChart

    let arrProdCreationChart=[['Month','New Products Upload']]
    for (i = 0; i <= date.getMonth(); i++) {
        curProd=await Product.find({
            created_at: {
                $gte: new Date(date.getFullYear(), i, 1), // Start of the month
                $lt: new Date(date.getFullYear(), i+1, 1), // Start of the next month
            },
        }).countDocuments()
        arrProdCreationChart.push([
            new Date(date.getFullYear(), i).toLocaleString('default', { month: 'long' }),
            curProd
        ])
    }
    result.prodCreationChart=arrProdCreationChart

    res.json(sendResponse(1,result))
};
const dashboardDataVendor = async (req, res, next) => {
    let result={}
    result.numOrders=(await Order.find({vendor_id:req.headers.user_data._id}).distinct('order_id').lean().exec()).length+(await FileOrder.find({vendor_id:req.headers.user_data._id}).distinct('order_id').lean().exec()).length
    result.numProds=await Product.find({created_by:req.headers.user_data._id}).countDocuments()

    let date=new Date()
    // let arrVendorConversion=[['Month','New Customer','Invited','Created']]
    // for (i = 0; i <= date.getMonth(); i++) {
    //     curCustomers=await User.find({
    //         created_at: {
    //             $gte: new Date(date.getFullYear(), i, 1), // Start of the month
    //             $lt: new Date(date.getFullYear(), i+1, 1), // Start of the next month
    //         },role:'CUSTOMER'
    //     }).countDocuments()
    //     curVendorsInvited=await Invite.find({
    //         created_at: {
    //             $gte: new Date(date.getFullYear(), i, 1), // Start of the month
    //             $lt: new Date(date.getFullYear(), i+1, 1), // Start of the next month
    //         },
    //     }).countDocuments()
    //     curVendorsCreated=await User.find({
    //         created_at: {
    //             $gte: new Date(date.getFullYear(), i, 1), // Start of the month
    //             $lt: new Date(date.getFullYear(), i+1, 1), // Start of the next month
    //         },
    //         role:'VENDOR'
    //     }).countDocuments()
    //     arrVendorConversion.push([
    //         new Date(date.getFullYear(), i).toLocaleString('default', { month: 'long' }),
    //         curCustomers,
    //         curVendorsInvited,
    //         curVendorsCreated
    //     ])
    // }
    // result.vendorConversiuonChart=arrVendorConversion
    //
    let arrOrderChart=[['Month','Common Order','File Order']]
    for (i = 0; i <= date.getMonth(); i++) {
        curOrds=await Order.find({
            created_at: {
                $gte: new Date(date.getFullYear(), i, 1), // Start of the month
                $lt: new Date(date.getFullYear(), i+1, 1), // Start of the next month
            },
            vendor_id:req.headers.user_data._id
        }).distinct('order_id').lean().exec()
        curFileOrds=await FileOrder.find({
            created_at: {
                $gte: new Date(date.getFullYear(), i, 1), // Start of the month
                $lt: new Date(date.getFullYear(), i+1, 1), // Start of the next month
            },
            vendor_id:req.headers.user_data._id
        }).distinct('order_id').lean().exec()
        arrOrderChart.push([
            new Date(date.getFullYear(), i).toLocaleString('default', { month: 'long' }),
            curOrds.length,
            curFileOrds.length
        ])
    }
    result.orderChart=arrOrderChart

    let arrProdCreationChart=[['Month','New Products Upload']]
    for (i = 0; i <= date.getMonth(); i++) {
        curProd=await Product.find({
            created_at: {
                $gte: new Date(date.getFullYear(), i, 1), // Start of the month
                $lt: new Date(date.getFullYear(), i+1, 1), // Start of the next month
            },
            created_by:req.headers.user_data._id
        }).countDocuments()
        arrProdCreationChart.push([
            new Date(date.getFullYear(), i).toLocaleString('default', { month: 'long' }),
            curProd
        ])
    }
    result.prodCreationChart=arrProdCreationChart

    res.json(sendResponse(1,result))
};
const vendorListByDomainLocation = async (req, res, next) => {
    findParams={domain:req.body.domain,active:{vendor:true,admin:true}}
    if (req.body.search){
        findParams.$text={$search: req.body.search}
    }
    Product.find(findParams).select('created_by').lean().then(async doc => {
        allVendorIds=doc.map(obj=>{
            return obj.created_by
        })
        uniqueVendorIds = [...new Set(allVendorIds)].map(obj=>{
            return mongoose.Types.ObjectId(obj)
        })
        let vendors = await User.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates:req.body.location },
                    distanceField: 'distance',
                    spherical: true,
                    maxDistance: Number(req.body.max_distance),
                },
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
                            {$project: {is_local: 1, path: 1, reference: 1}}
                        ],
                    },
            },
            {
                $lookup:
                    {
                        from: 'subscriptionmembers',
                        localField: '_id',
                        foreignField: 'created_by',
                        as: 'subscription',
                        pipeline: [
                            {
                                $match: {
                                    $and: [
                                        {'status': 'ACTIVE'},
                                        {'validity.end': {$gte: now()}}
                                    ]
                                }
                            },
                            {
                                $lookup:
                                    {
                                        from: 'subscriptions',
                                        localField: 'subscription_id',
                                        foreignField: '_id',
                                        as: 'subscription_info',
                                    },
                            },
                            {$addFields: {str_subscription_id: {$toString: '$subscription_id'}}},
                            {
                                $lookup:
                                    {
                                        from: 'files',
                                        localField: 'str_subscription_id',
                                        foreignField: 'additional',
                                        as: 'subscription_img',
                                    },
                            },
                        ]
                    },
            },
            {
                $project: {
                    password: 0, verified: 0, permits: 0, created_at: 0, updated_at: 0
                }
            },
            {
                $match: {
                    _id: {$in: uniqueVendorIds},
                    active: true
                }
            },
        ]).exec()
        res.json(sendResponse(1,vendors))
        return
    }).catch(err=>{
        res.json(sendResponse(0,err))
        return
    })
};
const vendorListByDomainPincode = async (req, res, next) => {
    findParams={domain:req.body.domain,active:{vendor:true,admin:true},}
    if (req.body.search){
        findParams.$text={$search: req.body.search}
    }
    Product.find(findParams).select('created_by').lean().then(async doc => {
        allVendorIds=doc.map(obj=>{
            return obj.created_by
        })
        uniqueVendorIds = [...new Set(allVendorIds)].map(obj=>{
            return mongoose.Types.ObjectId(obj)
        })
        let vendors = await User.aggregate([
            {"$addFields": {"converted_id": {"$toString": "$_id"}}},
            {
                $lookup:
                    {
                        from: 'files',
                        localField: 'converted_id',
                        foreignField: 'additional',
                        as: 'images',
                        pipeline: [
                            {$project: {is_local: 1, path: 1, reference: 1}}
                        ],
                    },
            },
            {
                $lookup:
                    {
                        from: 'subscriptionmembers',
                        localField: '_id',
                        foreignField: 'created_by',
                        as: 'subscription',
                        pipeline: [
                            {
                                $match: {
                                    $and: [
                                        {'status': 'ACTIVE'},
                                        {'validity.end': {$gte: now()}}
                                    ]
                                }
                            },
                            {
                                $lookup:
                                    {
                                        from: 'subscriptions',
                                        localField: 'subscription_id',
                                        foreignField: '_id',
                                        as: 'subscription_info',
                                    },
                            },
                            {$addFields: {str_subscription_id: {$toString: '$subscription_id'}}},
                            {
                                $lookup:
                                    {
                                        from: 'files',
                                        localField: 'str_subscription_id',
                                        foreignField: 'additional',
                                        as: 'subscription_img',
                                    },
                            },
                        ]
                    },
            },
            {
                $project: {
                    password: 0, verified: 0, permits: 0, created_at: 0, updated_at: 0
                }
            },
            {
                $match: {
                    _id: {$in: uniqueVendorIds},
                    pincodes:req.body.pincode,
                    active:true
                }
            },
        ]).exec()
        res.json(sendResponse(1,vendors))
        return
    }).catch(err=>{
        res.json(sendResponse(0))
        return
    })
};

module.exports = {vendorListByDomainLocation,vendorListByDomainPincode,index,vendors,vendorsByProdSearchByLocation,vendorsByProdSearchByPincode, create, update,updateByPhone, login, logout, signup,dashboardDataAdmin,dashboardDataVendor};
