var express = require('express');
var router = express.Router();


router.get('/gitPush', function(req, res, next) {
    console.log("git push called");
    var exec = require('child_process').exec;
    var cmdStr = 'cd '+ docRoot +'&& gitu';
    exec(cmdStr, function(err,stdout,stderr){
        if(err) {
            console.log('git push error:'+stdout);
            res.json({code: 1, error: stdout})
        } else {
            console.log('git push success:'+stdout);
            res.json({code: 0, msg: stdout});
        }
    });
});


module.exports = router;
