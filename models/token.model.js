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
    expiry:{
        type:Date,
        default: Date.now() +(86400000 * process.env.TOKEN_EXPIRY)
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const Token = mongoose.model('Token', TokenModelSchema)

module.exports = {Token};
