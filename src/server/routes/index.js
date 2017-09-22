var express = require('express');
var router = express.Router();
var path=require('path');


router.get('/closeApp', function(req, res, next) {
    console.log("closeApp called");
    var exec = require('child_process').exec;
    var cmdStr = 'cd '+ rootDir +'&& npm stop';
    exec(cmdStr, function(err,stdout,stderr){
        if(err) {
            console.log('close app error:'+stderr);
            res.json({code: 1, error: err})
        } else {
            res.json({code: 0});
        }
    });

});

router.get('/*', (req, res) => {
    res.sendFile(path.join(rootDir+'/public', 'index.html'))
})

module.exports = router;
