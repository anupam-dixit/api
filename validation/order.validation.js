const myLib = require("../myLib")
const {Order} = require("../models/order.model")
const mongoose = require("mongoose");
const {sendResponse, hasPermission} = require("../myLib");
const {FileOrder} = require("../models/file-order.model");
const {isEmpty} = require("validator");
const {body} = require("express-validator");
const validation_list_order = async (req, res, next) => {
    if (await hasPermission(req.headers.user_data.role, "ORDERS_VIEW_ALL")){
        ;
    }
    if (await hasPermission(req.headers.user_data.role,"ORDERS_VIEW_SELF")){
        if (req.headers.user_data.role==="VENDOR"){
            req.body.vendor_id=mongoose.Types.ObjectId(req.headers.user_data._id)
        }
        if (req.headers.user_data.role==="CUSTOMER"){
            req.body.created_by=mongoose.Types.ObjectId(req.headers.user_data._id)
        }
    }
    if (req.body._id!==undefined){
        if (typeof _id === 'object'){
            res.json(sendResponse(0, "Validation returning for array of ids"))
            return
        } else {
            if (!mongoose.Types.ObjectId.isValid(req.body._id)){
                res.json(sendResponse(0, "Invalid ID"))
                return
            }
        }
    }
    next()
};
const validation_list_user_orders = async (req, res, next) => {
    numOrders=await Order.countDocuments({created_by:req.headers.user_data._id}).lean().exec()
    if (numOrders==0){
        res.json(sendResponse(0, "No orders found"))
        return
    }
    next()
};
const validation_create_order = async (req, res, next) => {
    next()
};
const validation_update_order = async (req, res, next) => {
    if (req.body.order_id===undefined){
        res.json(sendResponse(0, "Order number is required"))
        return
    }
    orderCount=Order.find({order_id:req.body.order_id}).countDocuments().lean().exec()
    if (orderCount===0){
        res.json(sendResponse(0, "Invalid Order Number"))
        return
    }
    if (req.body.status!==undefined){
        if (req.headers.user_data.user_type!=='sa'&&req.headers.user_data.user_type!=='s'){
            let order=await Order.findOne({order_id: req.body.order_id}).lean().exec()
            if (order.vendor_id.toString()!==req.headers.user_data._id.toString()){
                res.json(sendResponse(0, "You are not authorized for this action"))
                return
            }
        }
    }
    next()
};
const validation_delete_order = async (req, res, next) => {
    next()
};
const validation_create_file_order = async (req, res, next) => {
    if (req.body.order_id===undefined){
        res.json(sendResponse(0,'Order ID is required'))
        return
    }
    if (req.body.order_id.length>6||req.body.order_id.length<4){
        res.json(sendResponse(0,'Order ID too short'))
        return
    }
    inDb=await FileOrder.find({order_id: req.body.order_id}).countDocuments()
    if (inDb>0){
        res.json(sendResponse(0,'Pleasew refresh the page and try agian'))
        return
    }
    req.body.created_by=req.headers.user_data._id
    next()
};
module.exports = {validation_list_order,validation_list_user_orders,validation_create_order,validation_update_order,validation_delete_order,validation_create_file_order}
