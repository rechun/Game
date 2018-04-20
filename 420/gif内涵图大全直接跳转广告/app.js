//app.js
var aldstat = require("./utils/ald-stat.js");
var intbull = require("./utils/intbull.js");
App({
    onLaunch: function(options) {
        var that = this;
        var channel = options.query.ch; //获取场景值;
        this.globalData.channel = options.query.ch;
        var appId = 'wxd7d67165a524715c';
        var Appglobal = this;
        wx.getStorage({
            key: 'openId',
            success: function(res) { //获取本地存储的openId
                var userId = res.data; //用户的userId
                console.log("userid@@@@@@@@@@@@" + userId)
                that.globalData.openid = res.data;
                if (res.data) {
                    wx.request({
                        url: 'https://laohuangli.intbull.com/cmd.jsp',
                        data: {
                            cmd: 'load_config',
                            user_id: userId,
                            package_name: appId,
                            appversion: '1.0.4.19',
                            channel: channel
                        },
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: function(res) {

                        }
                    })
                }
            },
            fail: function() {
                console.log('fail@@@@@@@@@@@@@');
                wx.login({ //微信登陆
                    success: function(res) {
                        if (res.code) {
                            var stateCode = res.code; //登陆凭证（5分钟）
                            wx.getUserInfo({
                                success: function(res) {
                                    var userInfo = res.userInfo; //用户信息
                                    var nickName = userInfo.nickName; //昵称
                                    var avatarUrl = userInfo.avatarUrl; //头像
                                    var encryptedData = res.encryptedData; //加密信息
                                    var iv = res.iv;
                                    wx.request({
                                        url: 'https://laohuangli.intbull.com/little/little.jsp',
                                        data: {
                                            cmd: 'login',
                                            channel: channel,
                                            app_id: appId,
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
                                            that.globalData.openid = res.data.open_id;
                                            wx.setStorage({
                                                key: "openId",
                                                data: openId
                                            });
                                            console.log('openId====' + openId);
                                        }
                                    })
                                }
                            })
                        } else {
                            console.log('获取用户登录态失败！' + res.errMsg)
                        }
                    }
                });
            },
            complete: function() {
                console.log('complete@@@@@@@@@@')
            }
        });
    },
    globalData: {
        userInfo: null,
        requestUrl: "https://route.showapi.com/255-1",
        appid: "27982",
        apiKey: "495a1755b3184e4f8dfe30f818eb1a5e",
        tText: '29',
        tImg: '10',
        tAudio: '31',
        tVideo: '41',
        showPic: true,
        advideosrc: '',
        apppath: '',
        openid: null,
        channel: null,

    }
})