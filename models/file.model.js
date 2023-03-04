var mongoose = require('mongoose')

const FileModelSchema  = new mongoose.Schema({
    is_local: {
        type:Boolean,
        default:true
    },
    path: {
        type:String,
        required: true,
    },
    reference: {
        type: String,
    },
    additional: {
        type: String,
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const Files = mongoose.model('Files', FileModelSchema)

module.exports = {Files};
