const myLib = require("../myLib");
const {Permission} = require("../models/permission.model");
const {Role} = require("../models/role.model");
const {RoleHasPermission} = require("../models/role-has-permission.model");
const mongoose = require("mongoose");
const {User} = require("../models/user.model");
const update = async (req, res, next) => {
    // Domain.findOneAndUpdate({_id:req.body._id}, req.body, {upsert: false}, function(err, doc) {
    //     if (err){
    //         res.json(myLib.sendResponse(0))
    //     }
    //     res.json(myLib.sendResponse(1))
    // });
};
const permissionList = async (req, res, next) => {
    var data = await Permission.find(req.body).lean().exec()
    res.json(myLib.sendResponse(1, data))
};
const remove = async (req, res, next) => {
    // Domain.findByIdAndDelete(req.body._id, function (err, doc) {
    //     if (err) res.json(myLib.sendResponse(0))
    //     else res.json(myLib.sendResponse(1))
    // });
};
const permissionCreate = async (req, res, next) => {
    let permission = new Permission(req.body);
    permission.save(async function (err, result) {
        if (err) {
            res.json(myLib.sendResponse(0, err))
            return
        } else {
            await res.json(myLib.sendResponse(1))
        }
    })
};
const permissionUpdate = async (req, res, next) => {
    let permission = await Permission.findByIdAndUpdate(req.body._id, req.body).then((doc) => {
        res.json(myLib.sendResponse(1))
    }).catch((err) => {
        res.json(myLib.sendResponse(0))
    })
};
const myRolePermissions = async (req, res, next) => {
    let myRolePerm = await RoleHasPermission.find({role: req.headers.user_data.role}).lean().exec()
    res.json(myLib.sendResponse(1, myRolePerm))
    return
};
const roleList = async (req, res, next) => {
    let matcData=req.body
    let roles = await Role.aggregate([
        {$match:matcData}
        ,{
            $lookup:
                {
                    from: 'rolehaspermissions',
                    localField: 'code',
                    foreignField: 'role',
                    // Below pipeline is used to show only name from Users joining
                    pipeline: [
                        {$project: {permission: 1}}
                    ],
                    as: 'has_permissions'
                },
        }
    ])
    res.json(myLib.sendResponse(1, roles))
    return
};
const roleCreate = async (req, res, next) => {
    let role = new Role(req.body);
    role.save(async function (err, result) {
        if (err) {
            res.json(myLib.sendResponse(0))
            return
        } else {
            res.json(myLib.sendResponse(1))
            return
        }
    })
};
const roleUpdate = async (req, res, next) => {
    let role = await Role.findById(req.body._id).lean().exec()
    let rolePre=role.code
    let updatedRole= await Role.findByIdAndUpdate(req.body._id,req.body,{returnDocument:'after'}).catch(err=>{
        res.json(myLib.sendResponse(0, "Error occured while updating role please inform website admin"))
        return
    })
    let roleNow=updatedRole.code
    users=await User.updateMany({role:rolePre},{role:roleNow}).catch(err=>{
        res.json(myLib.sendResponse(0, "Error occured while updating users please inform website admin"))
        return
    })
    roleHasPerms=await RoleHasPermission.updateMany({role:rolePre},{role:roleNow}).catch(err=>{
        res.json(myLib.sendResponse(0, "Error occured while updating Role Has Permission please inform website admin"))
        return
    })
    res.json(myLib.sendResponse(1))
    return
};
const roleDelete = async (req, res, next) => {
    let role = await Role.findByIdAndDelete(req.body._id, req.body).lean().exec().catch((err) => {
        res.json(myLib.sendResponse(0, "Error occured while removing role"))
        return
    })
    let roleHasPermission = await RoleHasPermission.findOneAndDelete({role: role.code}).lean().exec().catch((err) => {
        res.json(myLib.sendResponse(0, "Error occured while removing role's permissions"))
        return
    })
    let users = await User.updateMany({role: role.code}, {role: ''}).lean().exec().catch((err) => {
        res.json(myLib.sendResponse(0, "Error occured while removing user having this role"))
        return
    })
    res.json(myLib.sendResponse(1))
    return
};
const roleHasPermissionCreate = async (req, res, next) => {
    let roleHasPerm = new RoleHasPermission(req.body);
    roleHasPerm.save(async function (err, result) {
        if (err) {
            res.json(myLib.sendResponse(0, err))
            return
        } else {
            res.json(myLib.sendResponse(1))
            return
        }
    })
};
const roleHasPermissionUpdate = async (req, res, next) => {
    let roleHasPerm = await RoleHasPermission.updateOne({role:req.body.role}, req.body,{upsert:true}).then((doc) => {
        res.json(myLib.sendResponse(1))
    }).catch((err) => {
        res.json(myLib.sendResponse(0))
    })
};
const roleHasPermissionVerify = async (req, res, next) => {
    let data = await RoleHasPermission.find({role: mongoose.Types.ObjectId(req.body.role)}, {permission: mongoose.Types.ObjectId(req.body.permission)}).countDocuments().lean().exec()
    if (!data) {
        res.json(myLib.sendResponse(0, false))
        return
    }
    res.json(myLib.sendResponse(1, true))
    return
};


module.exports = {
    permissionList,
    permissionCreate,
    permissionUpdate,
    myRolePermissions,
    roleCreate,
    roleList,
    roleUpdate,
    roleDelete,
    roleHasPermissionCreate,
    roleHasPermissionUpdate,
    roleHasPermissionVerify,
    update,
    remove
};
