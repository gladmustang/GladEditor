var express = require('express');
var router = express.Router();



router.use('/', require('./index'));
router.use('/documents', require('./documents'));
router.use('/multipart', require('./multipart'));


module.exports = router;