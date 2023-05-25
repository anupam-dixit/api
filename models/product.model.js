var mongoose = require('mongoose')
const {Schema} = require("mongoose");
const {Files} = require("./file.model");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    mrp: {
        type: Number,
        required: true,
    },
    price_mod: {
        vendor: {
            mod_sign: {
                type: String,
                enum: ['+', '-'],
                default: '-'
            },
            mod_type: {
                type: String,
                enum: ['%', 'n'],
                default: 'n'
            },
            mod_amount: {
                type: Number,
                required: true,
                default: 0
            }
        },
    },
    domain: {
        type: Schema.Types.ObjectId,
        ref: 'Domain',
    },
    categ: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    sub_categ: [{
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
    }],
    active: {
        vendor:{
            type: Boolean,
            default: true,
            required:true,
        },
        admin:{
            required:true,
            type: Boolean,
            default: false,
        }
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    searh_keywords: {
        type: String
    },
}, {
    virtuals:true,
    toObject: {getters: true},
    toJSON: {getters: true},
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
ProductSchema.virtual('price').get(function() {
    let result
    if (this.price_mod.vendor.mod_type==='n'){
        result=this.mrp-this.price_mod.vendor.mod_amount
    }
    if (this.price_mod.vendor.mod_type==='%'){
        result=this.mrp-(this.mrp*this.price_mod.vendor.mod_amount/100)
    }
    return result
});
ProductSchema.index({
    'name': 'text',
    'description': 'text',
    'searh_keywords': 'text',
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = {Product};
