//app.js

var imageProcess = require('./utils/imageProcess.js');
App({
    globalData: {
        openId: '', // openid
        openGId: '', //群ID，
        shareTicket: '',
        auth: false, //是否授权
        screenInfo: {
            width: 375,
            height: 400
        },
    },

    onLaunch: function (options) {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
          } else {
            wx.cloud.init({ traceUser: true })
            this.getUserInfo()
        }
        this.globalData.screenInfo = imageProcess.getScreenInfo();

    },

    getUserInfo: () => {
        wx.cloud.callFunction({
            // 云函数名称
            name: 'getUserInfo',
            // 传给云函数的参数
            success(res) {
                wx.setStorageSync('openId', res.result.openid)
            },
            fail: console.error
        })
    },

    onShow: (opitions)=> {},

    // 页面找不到
    onPageNotFound(e) {},

    // 更新用户数据
    updateUserInfo(data) {},
})