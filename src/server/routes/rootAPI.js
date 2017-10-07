var express = require('express');
var router = express.Router();



router.use('/', require('./index'));
router.use('/documents', require('./documents'));
router.use('/multipart', require('./multipart'));
router.use('/translator', require('./translator'));


module.exports = router;