// pages/result/result.js
var app = getApp();
var config = require('../../utils/config.js');
var imageProcess = require('../../utils/imageProcess.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        image: "/images/defaultResult.png",
        scoreImage: '',
        text: '上传照片查看我的颜值分~',
        done: true,
        viewScoreImage: false, //显示分数的图片
        openGId: '',
        politician: false, // 敏感
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        wx.hideShareMenu();
        wx.updateShareMenu({
            withShareTicket: true
        })

        this.setData({
            openGId: options.openGId || ''
        })

        if (options.imagePath) {
            this.processImage(options.imagePath)
        }
    },


    onShow() {
        this.setData({
            openGId: app.globalData.openGId
        })
    },

    scoreImageLoaded() {
        var that = this;
        that.setData({
            showScoreImage: true,
            done: true,
            text: that.data.text
        });
        console.log('图片加载完毕');
    },


    scoreImageLoadedError() {
        var that = this;
        that.setData({
            done: true,
            text: '颜值计算失败，请重新操作~'
        });
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
                            that.processImage(image.path);
                        } else {
                            wx.showToast({
                                title: '文件太大',
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

    // 处理图片
    processImage(imagePath) {
        var that = this;
        that.setData({
            image: imagePath,
            hideShare: true,
            text: '',
            done: false,
            showScoreImage: false,
            politician: false, // 敏感
        });
        imageProcess.processingImage(that, app.globalData.screenInfo.width, 1000)
        wx.uploadFile({
            url: 'https://mediaplatform.msxiaobing.com/Image/Upload',
            filePath: imagePath,
            name: "file",
            header: {
                "content-tyep": "multipart/form-data"
            },
            success: function (res) {
                console.log('上传图片', res);

                if (200 != res.statusCode) {
                    that.setData({
                        text: '颜值计算失败，请重新操作~',
                        done: true,
                    });
                    return;
                }

                var res = JSON.parse(res.data),
                    imageUrl = res.Host + res.Url,
                    tid = imageProcess.makeTid(),
                    validate = imageProcess.EncryptDateTimeForImageProcess();


                wx.request({
                    url: 'https://minisite-skill.msxiaobing.com/Api/ImageAnalyze/Process?service=CSYanzhiWeApp' + "&tid=" + tid + "&validate=" + validate,
                    header: {
                        "content-type": "application/json"
                    },
                    method: "POST",
                    data: {
                        Content: {
                            ImageUrl: imageUrl
                        }
                    },
                    success: function (e) {
                        console.log('请求分数', e);
                        that.data.text = e.data.content.text
                        // 敏感图片
                        if (e.data.content.metadata.AnswerFeed.indexOf("PoliticianImage") >= 0) {

                            that.setData({
                                politician: true,
                                scoreImage: e.data.content.imageUrl
                            })
                        } else if (e.data.content.metadata.face) {

                            that.setData({
                                scoreImage: e.data.content.imageUrl,
                            })

                        } else {

                        }
                    },
                    fail: function (e) {
                        that.setData({
                            text: '颜值计算失败，请重新操作~',
                            done: true,
                        });
                    }
                });
            },
            fail: function (e) {
                that.setData({
                    text: '颜值计算失败，请重新操作~',
                    done: true,
                });
            }
        });
    },

    goRank() {
        wx.redirectTo({
            url: '/pages/rank/rank?reload=true',
        })
    },

    previewImage: function () {
        // 预览图片
        wx.previewImage({
            urls: [
                this.data.image_url
            ] // 需要预览的图片http链接列表
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '颜值榜第1就是我，要来一起比比颜值吗？',
            path: '/pages/rank/rank',
            imageUrl: ''
        };
    }
})