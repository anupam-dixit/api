const {Schema,mongoose} = require("mongoose");

const NotificationSchema  = new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    target_user_id: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    reference:{
        type:String,
        required:true
    },
    reference_code:{
        type:String,
        unique: true
    },
    status:{
        type:String,
        default:'STANDBY'
    },
    level:{
        type:Number,
        enum:[1,2,3],
        default:1
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
const Notification = mongoose.model('Notification', NotificationSchema)

module.exports = {Notification};
