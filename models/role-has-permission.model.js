var mongoose = require('mongoose')
const {Schema} = require("mongoose");

const RoleHasPermissionSchema  = new mongoose.Schema({
    role: {
        type:String,
        required:true
    },
    permission:[{
        type: String,
    }]
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
const RoleHasPermission = mongoose.model('RoleHasPermission', RoleHasPermissionSchema)

module.exports = {RoleHasPermission};
