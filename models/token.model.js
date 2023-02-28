var mongoose = require('mongoose')

const TokenModelSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    },
    user_id:{
        type:String,
        required:true
    },
    active :{
        type:Boolean,
        default:true,
    },
    expiry: {
        type:Date,
        required:true
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

const Token = mongoose.model('Token', TokenModelSchema)

module.exports = {Token};
