var app = getApp();
var timer;
var requestUrl = "https://route.showapi.com/255-1";
var curPage = 1;
var isPullDownRefreshing = false;
var intbull = require("../../utils/intbull.js");
Page({
    data: {
        showmode: false,
        listArray: [],
        videoCover: '../../images/other/pointnew.png',
        showPic: true,
        videocontrols: false,
        showmusic: true,
        playingIndex: null,
        beforeIndex: null,
        nowPlayVideo: null,
        videoArray: [],
        jokes: {},
        toastShow: 'none',
        dayplayNum: 0,
        ordinal: 0,
        adOrdinal: 0,
        appeared: 0,
        adAmount: 0,
        pageshow: 0,
    },
    onLoad: function(options) {
        var that = this;
        wx.request({
            url: 'https://laohuangli.intbull.com/little/little.jsp', //审核模式判断
            data: {
                cmd: 'switch',
                appversion: '1.0.4.20'
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                that.setData({
                    // showmode: true,
                    showmode: res.data.audit_mode,
                })
                console.log(that.data.showmode);
                if (JSON.stringify(that.data.showmode) == JSON.stringify(true)) { //true为审核模式
                    intbull.log('我的审核模式@@@@@@@@@@@');
                    that.fetchJoke();
                } else { //模板调用
                    intbull.log('我是抖音部分@@@@@@@@@');
                    that.videoload();
                    that.userInfo();
                }
            }
        })
    },
    onShow: function() {
        var that = this;
        if (app.globalData.openid) {
            console.log('老用户');
            that.setData({
                showpoint: 'none',
            })
        } else {
            that.setData({
                showpoint: 'block',
            })
            console.log('新用户');
            setTimeout(function() {
                that.setData({
                    showpoint: 'none',
                })
            }, 5000)
        }
        that.setData({
            pageshow: that.data.pageshow + 1,
        })
        if (that.data.pageshow > 1) {
            if (that.data.platform = 'apple') {
                that.videoload();
            }

        }
    },
    onReachBottom: function(e) { //触到底部；
        wx.stopPullDownRefresh(); //暂停刷新动画
        var that = this;
        if (JSON.stringify(that.data.showmode) == JSON.stringify(true)) { //true为审核模式
            that.fetchJoke();
        } else { //模板调用
            if (that.data.platform == 'apple') { //禁止上划
            } else if (that.data.platform == 'android') { //上划加载下一个视频
                wx.pageScrollTo({
                    scrollTop: 0
                });
                that.videoload();
            } else if (that.data.platform == 'devtools') { //模拟器测试
                wx.pageScrollTo({
                    scrollTop: 0
                });
                that.videoload();
            }
        }
    },
    onPullDownRefresh: function() { //下拉刷新视频
        wx.stopPullDownRefresh(); //暂停刷新动画
        var that = this;
        if (JSON.stringify(that.data.showmode) == JSON.stringify(true)) { //true为审核模式
            that.fetchJoke();
        } else { //模板调用
            if (that.data.platform == 'apple') { //苹果禁止下拉刷新
            } else if (that.data.platform == 'android') { //安卓下拉刷新
                wx.pageScrollTo({
                    scrollTop: 0
                });
                that.videoload();
            } else if (that.data.platform == 'devtools') { //模拟器测试
                wx.pageScrollTo({
                    scrollTop: 0
                });
                that.videoload();
            }
        }
    },
    userInfo: function() {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                var p = res.platform;

                if (p == 'android') { //安卓
                    console.log('info@@@andrid@@@@');
                    that.setData({
                        showNextBtn: 'none',
                        platform: 'android'
                    })
                } else if (p == 'devtools') { //模拟器
                    console.log('info模拟器@@@@');
                    that.setData({
                        adHeight: '100%',
                        showNextBtn: 'none',
                        platform: 'devtools',
                        iosHidden: 'hidden',
                        // iosheight: '100%',
                        videoCover: '../../images/other/pointnew_ios.png',
                    })
                } else { //苹果
                    console.log('info@@@apple@@@@');
                    that.setData({
                        adHeight: '100%',
                        showNextBtn: 'block',
                        platform: 'apple',
                        iosHidden: 'hidden',
                        iosheight: '100%',
                        videoCover: '../../images/other/pointnew_ios.png',
                    });
                    setTimeout(function() {
                        that.setData({
                            showpoint: 'none',
                        })
                    }, 5000)
                }
            }
        });
    },
    //笑话部分
    fetchJoke: function() {
        wx.showNavigationBarLoading();
        var that = this;
        wx.request({
            url: requestUrl,
            data: {
                'showapi_appid': app.globalData.appid,
                'showapi_sign': app.globalData.apiKey,
                'page': curPage.toString(),
                'type': app.globalData.tImg
            },
            method: 'GET',
            success: function(res) {
                // success
                if (curPage == 1)
                    that.setData({ jokes: res.data.showapi_res_body.pagebean.contentlist.reverse() });
                else
                    that.setData({ jokes: that.data.jokes.concat(res.data.showapi_res_body.pagebean.contentlist) });

                curPage = curPage + 3;
                wx.hideNavigationBarLoading();
                if (isPullDownRefreshing)
                    wx.stopPullDownRefresh();
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },
    previewImg: function(e) {
        console.log(e);
        wx.previewImage({
            // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
            urls: [e.currentTarget.dataset.imgurl],
            success: function(res) {
                console.log(e.currentTarget.dataset.imgurl);
                // success
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },
    //抖音部分
    hidepoint: function() {
        var that = this;
        that.setData({
            showpoint: 'none'
        });
        that.videoload();
    },
    nextVideo: function() {
        var that = this;
        that.videoload();
    },
    goapp: function(e) {
        app.aldstat.sendEvent('小程序跳转', {
            '广告点击': '成功'
        });
        wx.navigateToMiniProgram({
            appId: e.currentTarget.dataset.littleappid,
            path: e.currentTarget.dataset.apppath,
            extraData: {},
            envVersion: 'release',
            success(res) {
                console.log('跳转到别的小程序');
            }
        })
    },
    videoControls: function(e) { //控制栏显示
        var that = this;
        that.setData({
            videocontrols: true
        })
    },
    videoplay: function() {
        var that = this;
        console.log('正在播放的视频id@@@@@@@' + that.data.videoid);
    },
    videopause: function() {
        var that = this;
        console.log('暂停的视频Id@@@@@@@' + that.data.videoid);
    },
    videoend: function() {
        var that = this;
        console.log('播放结束的视频Id@@@@@@@' + that.data.videoid);
    },
    videoListload: function() { //视频列表加载
        var that = this;
        that.setData({
            showPage: 'block',
            videoShow: 'block',
        })
        if (that.data.ordinal > that.data.videolistnum - 2) {
            that.setData({
                ordinal: 0,
            })
            wx.request({
                url: 'https://laohuangli.intbull.com/vod.jsp',
                data: {
                    cmd: 'video_list_little_app',
                    type: 47,
                    callback: that.data.callbacknum
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function(res) {
                    console.log('该翻页了@@@');
                    var num = res.data.callback;
                    that.setData({
                        callbacknum: num,
                        videlArray: res.data.data
                    })
                }
            })
        } else {
            wx.request({
                url: 'https://laohuangli.intbull.com/vod.jsp',
                data: {
                    cmd: 'video_list_little_app',
                    type: 47,
                    callback: that.data.callbacknum,
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function(res) {
                    that.setData({
                            ordinal: that.data.ordinal + 1,
                            videlArray: res.data.data
                        })
                        // console.log('videolistnum@@@@' + that.data.videolistnum);
                    var VideoFirst = res.data.data[that.data.ordinal];
                    that.setData({
                        videoTop: '0',
                        videoShow: 'block',
                        adShow: 'none',
                        videoSrc: VideoFirst.url, //视频地址
                        videoid: 'video' + VideoFirst.id,
                    });
                }
            })
        }
    },
    videoload: function() {
        var that = this;
        //console.log('视频广告列表');
        app.aldstat.sendEvent('视频播放', {
            '视频': '播放'
        });
        wx.request({
            url: 'https://laohuangli.intbull.com/vod.jsp',
            data: {
                cmd: 'video_list_little_app',
                type: 47,
                callback: that.data.callbacknum
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                that.setData({
                    adRate: res.data.adRate, //信息流中广告出现的次数
                    adList: res.data.adData, //广告列表
                    adNum: res.data.adData.length,
                    videolistnum: res.data.data.length,
                })
                if (that.data.adRate > that.data.appeared) { //开始循环广告;展示的视频数小于广告间隔
                    that.videoListload();
                    console.log('正常加载视频列表');
                    that.setData({
                        appeared: that.data.appeared + 1
                    })
                } else { //展示的视频数到了广告间隔
                    if (that.data.adAmount < that.data.adNum) { //循环广告列表
                        var adInShow = that.data.adList[that.data.adAmount];
                        that.setData({
                            adAmount: that.data.adAmount + 1,
                            appeared: 0, //展示广告数归零
                        });
                        if (adInShow.littleAutoJump > 0) {
                            console.log('跳转广告//////');
                            that.videoListload();
                            setTimeout(function() {
                                wx.navigateToMiniProgram({
                                    appId: adInShow.littleAppId,
                                    path: adInShow.littleAppPath,
                                    extraData: {},
                                    envVersion: 'release',
                                    success(res) {
                                        // console.log('跳转到别的小程序');
                                        app.aldstat.sendEvent('视频中插入的小程序跳转', {
                                            '视频中的小程序': '跳转成功'
                                        });
                                    },
                                    complete() {
                                        console.log('跳转到别的小程序');
                                    }
                                })
                            }, 1000 * adInShow.littleAutoJump)
                        } else {
                            console.log('显示广告');
                            that.setData({
                                adShow: 'block',
                                videoShow: 'none',
                                videoTop: '0',
                                littleAppPath: adInShow.littleAppPath,
                                littleAppImage: adInShow.imgUrl,
                                littleAppId: adInShow.littleAppId,
                                videoSrc: 'https://github.com/rechun/Game/blob/master/WXVideo/cats.mp4',
                            })
                        }
                    } else { //没有广告了，直接展示视频了
                        console.log('没有广告了直接播放视频');
                        that.videoListload();
                    }
                }
            }
        })
    }
})