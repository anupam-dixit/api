const {Product} = require("../models/product.model");
const myLib = require("../myLib");
const {generateToken, decodeToken} = require("../myLib");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const {Files} = require("../models/file.model");
const {User} = require("../models/user.model");

const index = async (req, res, next) => {
    if (req.body.own !== undefined && req.body.own === '1') {
        req.body.created_by = req.headers.user_data._id
        delete req.body.own
    }
    let data
    if (req.body.simplify === '1') {
        delete req.body.simplify
        let matchData = {
            active:{
                vendor:true,
                admin:true
            }
        }
        if (req.body.pincode!==undefined&&parseInt(req.body.pincode)>0){
            let vendors=await User.find({pincodes: '123'}).select('_id').lean().exec()
            vendors=vendors.map(function (item) {
                return item._id
            })
            matchData={
                created_by:{
                    $in:vendors
                }
            }
        }
        if (req.body.vendor!==undefined){
            if (!mongoose.Types.ObjectId.isValid(req.body.vendor)){
                res.json(myLib.sendResponse(0, 'Invalid vendor id'));
            }
            vendor=await User.findById(req.body.vendor).lean().exec()
            if (!vendor){
                res.json(myLib.sendResponse(0, 'Incorrect vendor id'));
            }
            matchData.created_by=mongoose.Types.ObjectId(req.body.vendor)
        }
        if (req.body._id !== undefined) {
            if (typeof req.body._id=='object') {
                req.body._id = req.body._id.map(v=>mongoose.Types.ObjectId(v))
                matchData={
                    _id:{
                        $in:req.body._id
                    }
                }
            } else {
                matchData={_id:mongoose.Types.ObjectId(req.body._id)}
            }
        }
        if (req.body.categ!==undefined){
            matchData.categ=mongoose.Types.ObjectId(req.body.categ)
        }
        if (req.body.domain!==undefined){
            matchData.domain=mongoose.Types.ObjectId(req.body.domain)
        }
        data = await Product.aggregate([
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
                $lookup:
                    {
                        from: 'users',
                        localField: 'created_by',
                        foreignField: '_id',
                        as: 'vendor_details',
                        pipeline: [
                            {$project: {name: 1,phone:1, address: 1,location:1,permits:1,welcome_message:1}},
                            {$addFields:{"__id": {"$toString": "$_id"}}},
                            {
                                $lookup:
                                    {
                                        from: 'files',
                                        localField: '__id',
                                        foreignField: 'additional',
                                        as: 'media',
                                        pipeline: [
                                            {
                                                $match: {
                                                    reference: {
                                                        $not: { $regex: /.pending/}
                                                    }
                                                }
                                            }
                                        ]
                                    },
                            },
                            {
                                $lookup:
                                    {
                                        from: 'domains',
                                        localField: 'permits.domains',
                                        foreignField: '_id',
                                        as: 'permits.domains',
                                        pipeline: [
                                            {$project: {title: 1}}
                                        ]
                                    },
                            }
                        ],
                    },
            },
            {
                $lookup:
                    {
                        from: 'domains',
                        localField: 'domain',
                        foreignField: '_id',
                        as: '_domain',
                        pipeline: [
                            {$project: {title: 1}}
                        ],
                    },
            },
            {
                $lookup:
                    {
                        from: 'categories',
                        localField: 'categ',
                        foreignField: '_id',
                        as: '_categ',
                    },
            },
            {
                $lookup:
                    {
                        from: 'subcategories',
                        localField: 'sub_categ',
                        foreignField: '_id',
                        as: '_sub_categ',
                    },
            }
        ]).project({domain: 0, categ: 0, sub_categ: 0}).exec()
    }
    else {
        data = await Product.find(req.body).populate(['domain', 'categ', 'sub_categ']).populate('created_by','name').lean().exec()
    }
    data=data.map(v=>{
        v.price=myLib.pricer(v.mrp,v.price_mod.vendor.mod_sign,v.price_mod.vendor.mod_type,v.price_mod.vendor.mod_amount)
        return v
    })

    res.json(myLib.sendResponse(1, data));
};
const create = async (req, res, next) => {
    req.body.created_by = req.headers.user_data._id
    const dataToCreate = new Product(req.body);
    dataToCreate.save(async function (err, result) {
        if (err) {
            res.json(myLib.sendResponse(0, err))
            return
        } else {
            await res.json(myLib.sendResponse(1, "Added successfully"))
        }
    })
};
const update = async (req, res, next) => {
    const stts = await Product.updateOne({_id: req.body._id}, req.body).then((doc) => {
        res.json(myLib.sendResponse(1))
    }).catch((err) => {
        res.json(myLib.sendResponse(0))
    })
};
const toggle_active = async (req, res, next) => {
    const product = await Product.findById(req.body._id)
    if (req.body.active.admin!==undefined){
        product.active.admin=req.body.active.admin
    }
    if (req.body.active.vendor!==undefined){
        product.active.vendor=req.body.active.vendor
    }
    await product.save((err,doc)=>{
        if (err) {
            res.json(myLib.sendResponse(0))
            return
        }
        else {
            res.json(myLib.sendResponse(1))
            return
        }
    })
};
const remove = async (req, res, next) => {
    images = await Files.find({reference: 'product_image', additional: req.params._id}).lean().exec()
    if (images) {
        images.forEach((obj) => {
            myLib.delFile(obj.path)
            dbFileToDelete = Files.findByIdAndDelete(obj._id).lean().exec()
        });
    }
    await Product.findByIdAndDelete(req.params._id).lean().exec().then((doc) => {
        res.json(myLib.sendResponse(1))
    }).catch((e) => {
        res.json(myLib.sendResponse(0))
    })
    return
};
const search = async (req, res, next) => {
    // let data=await Product.find({$text: {$search: req.body.search}}).exec();
    let data=await Product.aggregate([
        {$match: {$text: {$search: req.body.search},active:{vendor:true,admin:true}}},
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
            $lookup:
                {
                    from: 'users',
                    localField: 'created_by',
                    foreignField: '_id',
                    as: 'vendor_details',
                    pipeline: [
                        {$project: {name: 1, address: 1}}
                    ],
                },
        },
        {
            $lookup:
                {
                    from: 'domains',
                    localField: 'domain',
                    foreignField: '_id',
                    as: '_domain',
                    pipeline: [
                        {$project: {title: 1}}
                    ],
                },
        },
        {
            $lookup:
                {
                    from: 'categories',
                    localField: 'categ',
                    foreignField: '_id',
                    as: '_categ',
                },
        },
        {
            $lookup:
                {
                    from: 'subcategories',
                    localField: 'sub_categ',
                    foreignField: '_id',
                    as: '_sub_categ',
                },
        }]).project({domain: 0, categ: 0, sub_categ: 0}).exec()
    res.json(myLib.sendResponse(1,data))
};

module.exports = {index, create, update,toggle_active, remove, search};
