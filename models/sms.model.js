var mongoose = require('mongoose')

const SmsModelSchema  = new mongoose.Schema({
    trans_id:{
        type:String,
    },
    phone:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    type:{
        type:String,
        default:"sms"
    },
    delivery_status:{
        type:Boolean,
        required:true
    },
    active :{
        type:Boolean,
        default:true,
    },
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const Sms = mongoose.model('Sms', SmsModelSchema)

module.exports = {Sms};
