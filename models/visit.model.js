var mongoose = require('mongoose')
const {Schema} = require("mongoose");

const VisitSchema  = new mongoose.Schema({
    ip: {
        type:String
    },
    page_code: {
        type:String
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
const Visit = mongoose.model('Visit', VisitSchema)

module.exports = {Visit};
