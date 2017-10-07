var express = require('express');
var router = express.Router();
var path=require('path');


router.use('/', require('./index'));
router.use('/documents', require('./documents'));
router.use('/multipart', require('./multipart'));
router.use('/translator', require('./translator'));
router.use('/gitOps', require('./gitOps'));

router.get('/*', (req, res) => {
    res.sendFile(path.join(rootDir+'/public', 'index.html'))
})

module.exports = router;