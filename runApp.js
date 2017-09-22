var path=require('path');

console.log("Starting app ...");
var exec = require('child_process').exec;
var existCheckCmd = 'npm run status';
exec(existCheckCmd, function(err,stdout,stderr){
    if(err) {
        console.log('Start app error:'+stderr);
        return;
    }
    if(stdout.indexOf("online")!=-1) {
        //app already started, open browser only
        require("./openBrowser");
        console.log("App already started, open browser only !");
        console.log("Start end !");
    } else {
        var cmdStr = 'cd '+ __dirname +'&& npm run startApp';
        exec(cmdStr, function(err,stdout,stderr){
            if(err) {
                console.log('Start app error:'+stderr);
                return;
            }
            console.log("Start end !");
        });
    }
});

