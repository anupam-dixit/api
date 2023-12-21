const {Notification} = require("../models/notification.model");
const {sendResponse} = require("../myLib");
const {User} = require("../models/user.model");
const {RoleHasPermission} = require("../models/role-has-permission.model");
const create = async (req, res, next) => {
    if (req.body.target_user_id!==undefined){
        Notification.create(req.body, function(err, doc) {
            if (err){
                res.json(sendResponse(0,err.toString()))
                return
            }
            res.json(sendResponse(1))
            return;
        });
    } else {
        roles=await RoleHasPermission.find({permission:{$in:req.body.permission}}).select("role").lean()
        if (roles.length==0){
            res.json(sendResponse(0,'No users'))
            return;
        }
        arrRoles=await roles.map(doc => doc.role);
        users=await User.find({role:{$in:arrRoles}}).select('_id').lean()
        stts=await users.map(doc => {
            notif=req.body
            notif.target_user_id=doc._id
            notif.reference_code=req.body.reference_code+'_'+req.body.target_user_id
            notif=new Notification(notif)
            notif.save().then(doc=>{
                ;
            }).catch(err=>{
                // console.log(err)
            })
        })
        res.json(sendResponse(1))
    }
};
const update = async (req, res, next) => {
    Notification.findOneAndUpdate({_id:req.params._id}, req.body, {upsert: false}, function(err, doc) {
        if (err){
            res.json(sendResponse(0))
        }
        res.json(sendResponse(1))
    });
};
const list = async (req, res, next) => {
    let data;
    if (req.body.num == true) {
        data = [
            await Notification.find({target_user_id: req.headers.user_data._id, level: 1,status:{$ne:'SEEN'}}).countDocuments(),
            await Notification.find({target_user_id: req.headers.user_data._id, level: 2,status:{$ne:'SEEN'}}).countDocuments(),
            await Notification.find({target_user_id: req.headers.user_data._id, level: 3,status:{$ne:'SEEN'}}).countDocuments(),
        ]
    } else {
        data = await Notification.find({target_user_id: req.headers.user_data._id}).sort({ created_at: -1 }).lean().exec()
    }
    res.json(sendResponse(1, data))
};
const listDt = async (req, res, next) => {
    data=await Notification.find({target_user_id:req.headers.user_data._id,level:req.body.level}).lean()
    data=data.map(notification => ({
        ...notification,
            action:"<button onclick='alert(\'hi\')'>ok</button>"
    }));
    const draw = req.body.draw;
    const start = req.body.start;
    const length = req.body.length;
    const searchValue = (req.body.search) ? req.body.search.value : null;

    const filteredData = data.filter(item => {
        return (searchValue)?item.description.toLowerCase().includes(searchValue.toLowerCase()):item.description
        }
    );
    const paginatedData = filteredData.slice(start, start + length);

    res.json({
        draw: draw,
        recordsTotal: data.length,
        recordsFiltered: filteredData.length,
        data: paginatedData
    });
};
const remove = async (req, res, next) => {
    Notification.findByIdAndDelete(req.params._id, function (err, doc) {
        if (err) res.json(sendResponse(0))
        else res.json(sendResponse(1))
    });
};

module.exports = {create, list, listDt, update, remove};
