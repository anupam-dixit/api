const {Order} = require("../models/order.model");
const mongoose = require("mongoose");
const {body} = require("express-validator");
const {sendResponse, randomString} = require("../myLib");

const index = async (req, res, next) => {
    data=await Order.find(req.body).lean().exec()
    if (!data){
        res.json(sendResponse(0, "No data found"))
        return
    }
    res.json(sendResponse(1, data))
};
const create = async (req, res, next) => {
    orderId=randomString()
    // Get uinique product ids
    let ids = req.body.data.map(item => {
        if (item.name === 'field_id') {
            return item.value
        }
    })
    ids = ids.filter(obj => obj)
    for (i = 0; i < ids.length; i++) {
        curProductId=ids[i]
        curQuantity = req.body.data.map(item => {
            return (item.name === 'field_quant_' + ids[i]) ? item.value : null
        })
        curQuantity= curQuantity.filter(obj=>obj)
        curVendorId = req.body.data.map(item => {
            return (item.name === 'field_vendor_id_' + ids[i]) ? item.value : null
        })
        curVendorId=curVendorId.filter(obj=>obj)
        curUnitPrice = req.body.data.map(item => {
            return (item.name === 'field_unit_price_' + ids[i]) ? item.value : null
        })
        curUnitPrice=curUnitPrice.filter(obj=>obj)
        curPrice = req.body.data.map(item => {
            return (item.name === 'field_price_' + ids[i]) ? item.value : null
        })
        curPrice=curPrice.filter(obj=>obj)
        order=new Order
        order.randomString=orderId
        order.vendor_id=curVendorId[0]
        order.product_id=curProductId
        order.unit_price=curUnitPrice[0]
        order.quantity=curQuantity[0]
        order.price=curPrice[0]
        order.created_by=req.headers.user_data._id
        order.save((err,doc)=>{
            if (err) {
                res.json(sendResponse(0,err))
                return
            }
        })
    }
    res.json(sendResponse(1,"Order Placed successfully"))
};
const update = async (req, res, next) => {
    // const stts = await Product.updateOne({_id: req.body._id}, req.body).then((doc) => {
    //     res.json(myLib.sendResponse(1))
    // }).catch((err) => {
    //     res.json(myLib.sendResponse(0))
    // })
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

module.exports = {index, create, update, remove};
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
