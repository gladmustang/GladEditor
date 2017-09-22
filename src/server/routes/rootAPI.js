var express = require('express');
var router = express.Router();



router.use('/', require('./index'));
router.use('/documents', require('./documents'));


module.exports = router;