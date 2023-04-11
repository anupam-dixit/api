const myLib = require("../myLib")
const {Order} = require("../models/order.model")
const mongoose = require("mongoose");
const validation_create_order = async (req, res, next) => {
    next()
};
const validation_update_order = async (req, res, next) => {

    next()
};
const validation_delete_order = async (req, res, next) => {
    next()
};
module.exports = {validation_create_order,validation_update_order,validation_delete_order}
