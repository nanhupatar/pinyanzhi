//app.js

var imageProcess = require('./utils/imageProcess.js');
App({
    globalData: {
        openId: '', // 别人的openid
        ownOpenId: '',
        openGId: '', //群ID，
        shareTicket: '',
        auth: false, //是否授权
        screenInfo: {
            width: 375,
            height: 400
        },
    },

    // 获取排行榜回调函数
    getRankCallBack: null,

    onLaunch: function(options) {
        this.globalData.screenInfo = imageProcess.getScreenInfo();
    },

    onShow: function(options) {},

    // 页面找不到
    onPageNotFound(e) {},

    // 更新用户数据
    updateUserInfo(data) {},
})