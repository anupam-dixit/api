var mongoose = require('mongoose')
const {Schema} = require("mongoose");

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
    discount_range:[{
        percent:Array,
        flat:Array
    }],
    active :{
        type:Boolean,
        default:true,
    },
    created_by:{
        type:Schema.Types.ObjectId,
        ref: 'User',
    },
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = {User};
