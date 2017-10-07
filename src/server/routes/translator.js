var express = require('express');
var router = express.Router();
var translator = require('translation.js');
var { translate, detect, audio } = translator;

router.post('/translate', function(req, res, next) {
    var sel = req.body.text;
    translate({
        text: sel,
        api: 'baidu'
    }).then(result => {
            var msg = result.dict? result.dict: result.result;
            res.json({code:0, result: msg});
            // console.log(result)
    }).catch(error => {
        // code 可能有下面几个值：
        // NETWORK_ERROR - 网络错误，可能是运行环境没有网络连接造成的
        // API_SERVER_ERROR - 网页翻译接口返回了错误的数据
        // UNSUPPORTED_LANG - 接口不支持的语种
        // NO_THIS_API - 没有找到你需要的接口
        // NETWORK_TIMEOUT - 查询网页接口超时了。由于目前没有设置超时时间，所以暂时不会出现这个错误
        console.log(error.code)
        res.json({code:1, error: error});
    })
});


module.exports = router;
