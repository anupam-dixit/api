var mongoose = require('mongoose')
const {Schema} = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        maxLength: 13,
        minLength: 10,
        required: true
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    pincodes: {
        type: Array,
    },
    area: {
        type: String,
    },
    city: {
        type: String,
    },
    address: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['m', 'f']
    },
    role: {
        type: String,
        default: 'CUSTOMER',
        uppercase:true
    },
    location:
        {
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'
                default: 'Point',
                required: false
            },
            coordinates: {
                type: [Number],
                required: false,
                default:[0,0]
                /**
                 * longitude,latitude Example=>
                 * {
                 *   "type" : "Point",
                 *   "coordinates" : [
                 *     -122.5,
                 *     37.7
                 *   ]
                 * }
                 */
            }
        },
    verified: {
        type: Array,
    },
    permits: {
        discount_range: {
            percent: [{type: Number}],
            flat: [{type: Number}]
        },
        domains: [{
            type: Schema.Types.ObjectId,
            ref: 'Domain'
        }]
    },
    welcome_message:{
        type:String,
    },
    upi_id:{
        type:String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
UserSchema.index({location: '2dsphere'});
const User = mongoose.model('User', UserSchema)

module.exports = {User};
