var mongoose = require('mongoose')
const {Schema} = require("mongoose");

const SubCategorySchema  = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    categories:[{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
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

const SubCategory = mongoose.model('SubCategory', SubCategorySchema)

module.exports = {SubCategory};
