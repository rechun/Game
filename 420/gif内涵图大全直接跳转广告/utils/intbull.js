var debug = true;

function log(r) {
    if (debug) {
        console.log(r);
    }
}

function wxlogin(callback) {
    wx.login({ //微信登陆
        success: function(res) {
            if (res.code) {
                var stateCode = res.code; //登陆凭证（5分钟
                wx.getUserInfo({
                    success: function(res) {
                        var encryptedData = res.encryptedData; //加密信息
                        var iv = res.iv;
                        log('登陆凭证' + stateCode);
                        log('encryptedData' + encryptedData + '============iv=======' + iv);
                        wx.request({
                            url: 'https://laohuangli.intbull.com/little/little.jsp',
                            data: {
                                cmd: 'login',
                                channel: getChannel(),
                                code: stateCode,
                                encrypted_data: encryptedData,
                                iv: iv
                            },
                            header: {
                                'content-type': 'application/json'
                            },
                            success: function(res) {
                                var result = res.data.result; //正确时返回0
                                var openId = res.data.open_id; //OpenId本地缓存
                                wx.setStorage({
                                    key: "openId",
                                    data: openId
                                });
                                log('openId====' + openId);
                                if (callback) {
                                    callback.call(this, openId);
                                }
                            }
                        })
                    }
                })
            } else {
                log('获取用户登录态失败！' + res.errMsg)
            }
        }
    });
};

function request(url, data, callback, err) {
    wx.request({
        url: url,
        data,
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
            console.log(res + 'request成功')
            var reDate = res.data;
            if (callback) {
                callback.call(this, reDate);
            }
        },
        fail: function() {
            console.log('请求失败');
            if (err) {
                err.call(this, errdata)
            }

        }
    })
};

function load_config(data, callback) { //loda_config
    var pama = {
        cmd: 'load_config',
        user_id: openId,
        package_name: appId,
        channel: getChannel()
    }
    set(pama, data);
    wx.request({
        url: 'https://laohuangli.intbull.com/cmd.jsp',
        data: pama,
        header: {
            'content-type': 'application/json' // 默认值
        },
        success: function(res) {
            log(res.data); //用户数据
        }
    })
}

function getOpenId() { //取出账户的OpenId
    var openId = wx.getStorageSync('openId');
    if (openId) {
        return openId
    } else {
        return '';
    }
}

function getChannel() {
    var channel = wx.getStorageSync('channel'); //取出渠道号的值;
    if (channel) {
        return channel
    } else {
        return '';
    }
}

function init(options) {
    if (options.query.ch) {
        wx.setStorage({ //保存渠道号ch
            key: "channel",
            data: options.query.ch
        });
        log('ch=====' + options.query.ch);
    }
}

/**
 * 给Object赋值属性
 * @param {*Object} preObj 原始的属性
 * @param {*Object} obj 新加的属性
 */
function set(preObj, obj) { //循环对象属性赋值
    if (typeof(obj) == "object") {
        for (var k in obj) {
            preObj[k] = obj[k];
        }
    }
}
module.exports = {
    wxlogin: wxlogin,
    request: request,
    load_config: load_config,
    log: log,
    getOpenId: getOpenId,
    getChannel: getChannel,
    init: init,
    set: set,
}