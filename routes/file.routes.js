var express = require('express');
var router = express.Router();
const FileController=require('../controllers/file.controller');

/* GET Files listing. */
router.post('/', FileController.index);
router.post('/create', FileController.create);
// router.post("")

module.exports = router;
