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
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    updated_at:{
        type:Date,
        default:Date.now()
    }
})

const Files = mongoose.model('Files', FileModelSchema)

module.exports = {Files};
