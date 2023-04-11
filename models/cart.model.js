var mongoose = require('mongoose')
const {Schema} = require("mongoose");

const CartSchema  = new mongoose.Schema({
    vendor_id: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        require:true
    },
    product_id: {
        type:Schema.Types.ObjectId,
        ref: 'Product',
        require:true
    },
    unit_price: {
        type:Number,
        require:true
    },
    quantity: {
        type:Number,
        require:true
    },
    price: {
        type:Number,
        require:true
    },
    created_by: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        require:true
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
const Cart = mongoose.model('Cart', CartSchema)

module.exports = {Cart};
