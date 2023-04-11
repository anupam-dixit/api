var mongoose = require('mongoose')
const {Schema} = require("mongoose");

const OrderSchema  = new mongoose.Schema({
    order_id: {
        type:String,
    },
    vendor_id: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    product_id: {
        type:Schema.Types.ObjectId,
        ref: 'Product',
        required:true
    },
    unit_price: {
        type:Number,
        required:true
    },
    quantity: {
        type:Number,
        required:true
    },
    price: {
        type:Number,
        required:true
    },
    status:{
        order:{
            type:String,
            default:"RECEIVED"
        },
        payment:{
            type:String,
            default: "PENDING"
        }
    },
    created_by: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
const Order = mongoose.model('Order', OrderSchema)

module.exports = {Order};
