var mongoose = require('mongoose')

const UserSchema  = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    phone: {
        type:String,
        unique:true,
        maxLength:13,
        minLength:10,
        required:true
    },
    email: {
        type:String,
    },
    password: {
        type: String,
        required: true
    },
    pincodes: {
        type:Array,
    },
    area : {
        type: String,
    },
    city : {
        type: String,
    },
    address : {
        type: String,
    },
    gender:{
        type: String,
        enum : ['m','f']
    },
    user_type:{
        type: String,
        default: 'u'
    },
    verified:{
        type:Array,
    },
    active :{
        type:Boolean,
        default:true,
    },
    created_by:{
        type:Date,
        default:Date.now()
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

const User = mongoose.model('User', UserSchema)

module.exports = {User};
