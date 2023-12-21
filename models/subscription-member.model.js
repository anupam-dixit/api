var mongoose = require('mongoose')
const {Schema} = require("mongoose");

const SubscriptionMemberSchema  = new mongoose.Schema({
    subscription_id:{
        type:Schema.Types.ObjectId,
        ref: 'Subscription',
        required:true
    },
    validity:{
        start:{
            type:Date
        },
        end:{
            type:Date
        }
    },
    price:{
        type:Number,
        required: true
    },
    created_by: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        require:true
    },
    status:{
        type:String,
        default:"PENDING"
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
const SubscriptionMember = mongoose.model('SubscriptionMember', SubscriptionMemberSchema)

module.exports = {SubscriptionMember};
