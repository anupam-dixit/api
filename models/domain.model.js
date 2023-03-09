var mongoose = require('mongoose')
const {Schema} = require("mongoose");

const DomainSchema  = new mongoose.Schema({
    title: {
        type:String,
        required: true
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const Domain = mongoose.model('Domain', DomainSchema)

module.exports = {Domain};
