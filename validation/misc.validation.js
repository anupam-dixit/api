const {sendResponse} = require("../myLib");
const validation_address_list = async (req, res, next) => {
    if (req.body.lat===undefined||parseFloat(req.body.lat)<=0){
        res.json(sendResponse(0, "Latitude required in correct format"))
        return
    }
    if (req.body.lon===undefined||parseFloat(req.body.lon)<=0){
        res.json(sendResponse(0, "Longitude required in correct format"))
        return
    }
    if (req.body.lon==0){
        res.json(sendResponse(0, "Longitude incorrect"))
        return
    }
    if (req.body.lat==0){
        res.json(sendResponse(0, "Latitude incorrect"))
        return
    }
    next()
};
module.exports={validation_address_list}