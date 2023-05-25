var mongoose = require('mongoose')
const {Schema} = require("mongoose");

const RoleSchema  = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    code: {
        type:String,
        uppercase:true,
        required:true,
        unique:true
    },
    description: {
        type:String,
        uppercase:true,
    },
    active:{
        type:Boolean,
        required:true,
        default:true
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
const Role = mongoose.model('Role', RoleSchema)

module.exports = {Role};
