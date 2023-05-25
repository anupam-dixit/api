const myLib = require("../myLib");
exports.ensurePermission = function(permission){
    return async (req, res, next) => {
        if (!await myLib.hasPermission(req.headers.user_data.role, permission)){
            res.json(myLib.sendResponse(0, "You dont have permissions to perform this action"))
            return
        }
        next()
    }
}
