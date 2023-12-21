const {sendResponse} = require("../myLib");
const {Visit} = require("../models/visit.model");

const getAddressFromCord = async (req, res, next) => {
    const url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat='+req.body.lat+'&lon='+req.body.lon
    fetch(url)
        .then(response => response.json())
        .then(jsonData => {
            res.json(sendResponse(1,jsonData))
            return
        })
        .catch(err=>{
            res.json(sendResponse(0,err))
            return
        })
};
const createVisit = async (req, res, next) => {
    const dataToCreate = new Visit({
        ip:req.ip,
        page_code:'1',
    });
    dataToCreate.save(async function (err, result) {
        if (err) {
            res.json(sendResponse(0))
            return
        } else {
            await res.json(sendResponse(1))
            return
        }
    })
};
module.exports = {getAddressFromCord,createVisit};