const {Order} = require("../models/order.model");
const mongoose = require("mongoose");
const {sendResponse, randomString} = require("../myLib");
const {FileOrder} = require("../models/file-order.model");
const myLib = require("../myLib");
const {Files} = require("../models/file.model");
const {Notification} = require("../models/notification.model");
const dtOrdersSummary = async (req, res, next) => {

};
const index = async (req, res, next) => {
    if (req.body.file_ord == '1') {
        // data = await FileOrder.find(req.body).populate('vendor_id').populate('created_by').exec()
        delete req.body.file_ord
        data = await FileOrder.aggregate([
            {$addFields: {str_vendor_id:{ "$toString": "$vendor_id" }}},
            {$match:req.body},
            {
                $lookup:
                    {
                        from: 'files',
                        localField: 'order_id',
                        foreignField: 'additional',
                        as: 'images',
                        pipeline:[
                            {$project:{is_local:1,path:1,reference:1}}
                        ],
                    },
            },
            {
                $lookup:
                    {
                        from: 'files',
                        localField: 'str_vendor_id',
                        foreignField: 'additional',
                        as: 'qr_image',
                        pipeline:[
                            {
                                $match:{
                                    'reference':'qr_image'
                                }
                            },
                            {$project:{is_local:1,path:1,reference:1}},
                        ],
                    },
            },
            {
                $lookup:
                    {
                        from: 'users',
                        localField: 'vendor_id',
                        foreignField: '_id',
                        as: 'vendor_id',
                        pipeline:[
                            {$project:{name:1,phone:1,address:1,upi_id:1}}
                        ],
                    },
            },
            {
                $lookup:
                    {
                        from: 'users',
                        localField: 'created_by',
                        foreignField: '_id',
                        as: 'created_by',
                        pipeline:[
                            {$project:{name:1,phone:1,address:1,upi_id:1}}
                        ],
                    },
            }
        ])
    }
    else {
        // data = await Order.find(req.body).populate('product_id').populate('vendor_id').populate('created_by').lean().exec()
        data = await Order.aggregate([
            {$addFields: {str_vendor_id:{ "$toString": "$vendor_id" }}},
            {$match:req.body},
            {
                $lookup:
                    {
                        from: 'files',
                        localField: 'str_vendor_id',
                        foreignField: 'additional',
                        as: 'qr_image',
                        pipeline:[
                            {
                                $match:{
                                    'reference':'qr_image'
                                }
                            },
                            {$project:{is_local:1,path:1,reference:1}},
                        ],
                    },
            },
            {
                $lookup:
                    {
                        from: 'users',
                        localField: 'vendor_id',
                        foreignField: '_id',
                        as: 'vendor_id',
                        pipeline:[
                            {$project:{name:1,phone:1,address:1,upi_id:1}}
                        ],
                    },
            },
            {
                $lookup:
                    {
                        from: 'users',
                        localField: 'created_by',
                        foreignField: '_id',
                        as: 'created_by',
                        pipeline:[
                            {$project:{name:1,phone:1,address:1}}
                        ],
                    },
            },
            {
                $lookup:
                    {
                        from: 'products',
                        localField: 'product_id',
                        foreignField: '_id',
                        as: 'product_id',
                    },
            },
        ])
    }
    if (data.length === 0) {
        res.json(sendResponse(0, "No data found"))
        return
    }
    const arrPrice = data.map(d => parseFloat(d.price));
    const priceTotal = arrPrice.reduce((acc, curr) => acc + curr, 0);
    res.json({status: true, response: data, total: priceTotal})
};
const ordersSummary = async (req, res, next) => {
    let uniqueOrderIds
    if (req.headers.user_data.role === 'CUSTOMER') {
        if (req.body.file_orders == '1') {
            uniqueOrderIds = await FileOrder.distinct('order_id', {created_by: mongoose.Types.ObjectId(req.headers.user_data._id)}).lean().exec()
        } else {
            uniqueOrderIds = await Order.distinct('order_id', {created_by: mongoose.Types.ObjectId(req.headers.user_data._id)}).lean().exec()
        }
    } else if (req.headers.user_data.role === 'VENDOR') {
        if (req.body.file_orders == '1') {
            uniqueOrderIds = await FileOrder.distinct('order_id', {vendor_id: mongoose.Types.ObjectId(req.headers.user_data._id)}).lean().exec()
            console.log(uniqueOrderIds)
        } else {
            uniqueOrderIds = await Order.distinct('order_id', {vendor_id: mongoose.Types.ObjectId(req.headers.user_data._id)}).lean().exec()
            console.log(uniqueOrderIds)
        }
    } else {
        if (req.body.file_orders == '1') {
            uniqueOrderIds = await FileOrder.distinct('order_id').lean().exec()
        } else {
            uniqueOrderIds = await Order.distinct('order_id').lean().exec()
        }
    }
    let result = []
    for (i = 0; i < uniqueOrderIds.length; i++) {
        if (req.body.file_orders == '1') {
            curCount = await Files.countDocuments({additional: uniqueOrderIds[i]}).lean().exec()
            tempFirstOrder = await FileOrder.findOne({order_id: uniqueOrderIds[i]}).populate('created_by').populate('vendor_id').lean().exec()
        } else {
            curCount = await Order.countDocuments({order_id: uniqueOrderIds[i]}).lean().exec()
            tempFirstOrder = await Order.findOne({order_id: uniqueOrderIds[i]}).populate('created_by').populate('vendor_id').lean().exec()
        }
        curOn = uniqueOrderIds[i]
        curPlacedOn = tempFirstOrder.created_at
        curOrdst = tempFirstOrder.status.order
        curPayst = tempFirstOrder.status.payment
        curVendorName = (tempFirstOrder.vendor_id) ? tempFirstOrder.vendor_id.name : ''
        curBuyer = tempFirstOrder.created_by.name
        result.push({
            order_number: curOn,
            item_count: curCount,
            placed_on: curPlacedOn,
            order_status: curOrdst,
            payment_status: curPayst,
            vendor: curVendorName,
            user: curBuyer
        })
    }
    res.json(sendResponse(1, result))
};
const create = async (req, res, next) => {
    let uniqueVendorIds = []
    req.body.data.map(item => {
        if (item.name.startsWith('field_vendor_id_')) {
            if (!uniqueVendorIds.includes(item.value.replaceAll("field_vendor_id_", ""))) {
                uniqueVendorIds.push(item.value.replaceAll("field_vendor_id_", ""))
            }
            return
        }
    })

    for (j = 0; j < uniqueVendorIds.length; j++) {
        orderId = randomString(8)
        // Get uinique product ids
        let ids = req.body.data.map(item => {
            if (item.name === 'field_id') {
                return item.value
            }
        })
        ids = ids.filter(obj => obj)
        for (i = 0; i < ids.length; i++) {
            curProductId = ids[i]
            curQuantity = req.body.data.map(item => {
                return (item.name === 'field_quant_' + ids[i]) ? item.value : null
            })
            curQuantity = curQuantity.filter(obj => obj)
            curVendorId = req.body.data.map(item => {
                return (item.name === 'field_vendor_id_' + ids[i]) ? item.value : null
            })
            curVendorId = curVendorId.filter(obj => obj)

            if (curVendorId + "".trim() !== uniqueVendorIds[j] + "".trim()) {
                console.log(curVendorId + "!=" + uniqueVendorIds[j])
                continue
            }

            curUnitPrice = req.body.data.map(item => {
                return (item.name === 'field_unit_price_' + ids[i]) ? item.value : null
            })
            curUnitPrice = curUnitPrice.filter(obj => obj)
            curPrice = req.body.data.map(item => {
                return (item.name === 'field_price_' + ids[i]) ? item.value : null
            })
            curPrice = curPrice.filter(obj => obj)
            order = new Order
            order.order_id = orderId
            order.vendor_id = curVendorId[0]
            order.product_id = curProductId
            order.unit_price = curUnitPrice[0]
            order.quantity = curQuantity[0]
            order.price = curPrice[0]
            order.created_by = req.headers.user_data._id
            order.save(async (err, doc) => {
                if (err) {
                    console.log(order)
                    res.json(sendResponse(0, err))
                    return
                } else {
                    notifToVendor = new Notification
                    notifToVendor.title = 'Order Notification'
                    notifToVendor.description = 'Order ID: <b>' + orderId + '</b>'
                    notifToVendor.target_user_id = curVendorId[0]
                    notifToVendor.reference = 'ORDER_NOTIF_TO_VENDOR'
                    notifToVendor.reference_code = orderId+'_'+curVendorId[0]
                    notifToVendor.level = 3
                    notifToVendor.created_by = req.headers.user_data._id
                    notifToVendor.save().catch(err=>{
                        console.log(err)
                    })
                }
            })
        }
    }
    res.json(sendResponse(1, "Order Placed successfully"))
};
const update = async (req, res, next) => {
    if (req.body.file_ord !== undefined) {
        const stts = await FileOrder.updateMany({order_id: req.body.order_id}, req.body).then((doc) => {
            res.json(sendResponse(1))
            return
        }).catch((err) => {
            res.json(sendResponse(0))
            return
        })
    } else {
        const stts = await Order.updateMany({order_id: req.body.order_id}, req.body).then((doc) => {
            res.json(sendResponse(1))
            return
        }).catch((err) => {
            res.json(sendResponse(0))
            return
        })
    }
};
const remove = async (req, res, next) => {
    // images = await Files.find({reference: 'product_image', additional: req.params._id}).lean().exec()
    // if (images) {
    //     images.forEach((obj) => {
    //         myLib.delFile(obj.path)
    //         dbFileToDelete = Files.findByIdAndDelete(obj._id).lean().exec()
    //     });
    // }
    // await Product.findByIdAndDelete(req.params._id).lean().exec().then((doc) => {
    //     res.json(myLib.sendResponse(1))
    // }).catch((e) => {
    //     res.json(myLib.sendResponse(0))
    // })
    // return
};
const fileOrderCreate = async (req, res, next) => {
    let fileOrder = new FileOrder(req.body).save().then(doc => {
        res.json(myLib.sendResponse(1, {order_id: doc.order_id}))
        return
    }).catch(err => {
        res.json(myLib.sendResponse(0, err.message))
        return
    })
};

module.exports = {dtOrdersSummary,index, ordersSummary, create, update, remove, fileOrderCreate};
/**0
 * {name: 'field_quant_642823626cc7f60935c7135a', value: '1'}
 * 1
 * :
 * {name: 'field_id', value: '642823626cc7f60935c7135a'}
 * 2
 * :
 * {name: 'field_vendor_id_642823626cc7f60935c7135a', value: '6408934646d0c9cc16691361'}
 * 3
 * :
 * {name: 'field_price_642823626cc7f60935c7135a', value: '69'}
 * 4
 * :
 * {name: 'field_prod_id_642823626cc7f60935c7135a', value: '642823626cc7f60935c7135a'}
 * 5
 * :
 * {name: 'field_quant_6428256ad7356ee49dbb7f15', value: '1'}
 * 6
 * :
 * {name: 'field_id', value: '6428256ad7356ee49dbb7f15'}
 * 7
 * :
 * {name: 'field_vendor_id_6428256ad7356ee49dbb7f15', value: '6408934646d0c9cc16691361'}
 * 8
 * :
 * {name: 'field_price_6428256ad7356ee49dbb7f15', value: '36'}
 * 9
 * :
 * {name: 'field_prod_id_6428256ad7356ee49dbb7f15', value: '6428256ad7356ee49dbb7f15'}
 */
