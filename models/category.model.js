var mongoose = require('mongoose')
const {Schema} = require("mongoose");
const myLib = require("../myLib");

const CategorySchema  = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    description: {
        type:String,
    },
    active: {
        type:Boolean,
        default:true
    },
    created_by: {
        type:Schema.Types.ObjectId,
        ref: 'User',
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
const Category = mongoose.model('Category', CategorySchema)

module.exports = {Category};
