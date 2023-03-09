var mongoose = require('mongoose')
const {Schema} = require("mongoose");

const SubCategorySchema  = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    category_id:{
        type:Schema.Types.ObjectId,
        ref: 'Category',
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const SubCategory = mongoose.model('Sub_category', SubCategorySchema)

module.exports = {SubCategory};
