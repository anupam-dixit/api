var mongoose = require('mongoose')
const {Schema} = require("mongoose");

const InviteShopSchema  = new mongoose.Schema({
    entity_name: {
        type:String,
        required:true
    },
    phone: {
        type:String,
        maxLength:13,
        minLength:10,
        required:true
    },
    address : {
        type: String,
        required:true
    },
    active :{
        type:Boolean,
        default:true,
    },
    created_by:{
        required: true,
        type:Schema.Types.ObjectId,
        ref: 'User',
    },
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const Invite = mongoose.model('Invite', InviteShopSchema)

module.exports = {Invite};
