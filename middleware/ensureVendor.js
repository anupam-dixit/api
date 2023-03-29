const myLib = require("../myLib");
const ensureVendor = async (req, res, next) => {
    if (req.headers.user_data.user_type!=="v"){
        res.json(myLib.sendResponse(0, "Only Vendor can perform this action"))
        return
    }
    if (!req.headers.user_data.active){
        res.json(myLib.sendResponse(0, "Your account is not active"))
        return
    }
    next()
};
module.exports = {ensureVendor}
