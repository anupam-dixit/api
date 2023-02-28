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
    created_at:{
        type:Date,
        default:Date.now()
    },
    updated_at:{
        type:Date,
        default:Date.now()
    }
})

const Sms = mongoose.model('Sms', SmsModelSchema)

module.exports = {Sms};
