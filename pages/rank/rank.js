// pages/rank/rank.js
var app = getApp();
var config = require('../../utils/config.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openGId: '',
        friend: null,
        own: null,
        rank: [{
            score_avatar: "/images/defaultRank1.png",
            nickname: "Sherry",
            score: "10",
            wording: "荣登本群颜值之最！这颜值在此群完全找不到对手啊~",
        }, {
            score_avatar: "../../images/defaultRank2.png",
            nickname: "大胡子",
            score: "7",
            wording: "颜值越高，责任越大~这么高的颜值要承担的责任可不小呀~",
        }, {
            score_avatar: "../../images/defaultRank3.png",
            nickname: "兔兔长虎牙",
            score: "5",
            wording: "唉！长得太好看也是一种罪过..照镜子总被惊艳(⊙v⊙)",
        }],
        count: 0, //总人数
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu();
        wx.updateShareMenu({
            withShareTicket: true
        })
        console.log('进入排行榜页面', options);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (app.globalData.openGId) {
            app.getRankCallBack = null;
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },

    uploadImage: function (event) {
        app.updateUserInfo(event.detail);
        var that = this;
        wx.chooseImage({
            count: 1,
            sourceType: ["album", "camera"],
            sizeType: ["compressed"],
            success: function (data) {
                var image = data.tempFiles[0];
                wx.getImageInfo({
                    src: image.path,
                    success: function (n) {
                        if (image.size < config.imageSize) {
                            wx.redirectTo({
                                url: '/pages/result/result?imagePath=' + image.path + '&openGId=' + that.data.openGId,
                            })
                        } else {
                            wx.showToast({
                                title: '图片太大',
                                image: '/images/warning-circle-o.png'
                            });
                        }
                    },
                    fail: function (e) {
                        console.log('获取图片信息失败', e);
                    }
                })
            },
            fail: function (e) {
                console.log("取消选择图片", e);
            }
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '颜值榜第1就是我，要来一起比比颜值吗？',
            path: '/pages/rank/rank?openid=' + app.globalData.ownOpenId,
            imageUrl: ''
        };
    }
})