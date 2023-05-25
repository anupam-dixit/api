var mongoose = require('mongoose')
const {Schema} = require("mongoose");

const FileOrderSchema  = new mongoose.Schema({
    order_id: {
        type:String,
        required:true
    },
    vendor_id: {
        type:Schema.Types.ObjectId,
        ref: 'User',
    },
    price: {
        type:Number,
    },
    notes: {
        user:{
            type:String
        },
        vendor:{
            type:String
        }
    },
    status:{
        order:{
            type:String,
            required:true,
            default:"RECEIVED"
        },
        payment:{
            type:String,
            required:true,
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
const FileOrder = mongoose.model('FileOrder', FileOrderSchema)

module.exports = {FileOrder};
