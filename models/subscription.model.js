var mongoose = require('mongoose')
const {Schema} = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    validity: {
        type: Number,
        required: true
    },
    details:{
        type:String,
        required: true
    },
    active:{
        type:Boolean,
        default:true
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
const Subscription = mongoose.model('Subscription', SubscriptionSchema)

module.exports = {Subscription};
