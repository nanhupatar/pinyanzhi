// pages/result/result.js
var app = getApp();
var config = require('../../utils/config.js');
var imageProcess = require('../../utils/imageProcess.js');
import Poster from '../../components/wxa-plugin-canvas/poster/poster';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        image: "/images/defaultResult.png",
        scoreImage: '',
        text: '我这么美，我这么美，我怎么这么美~~',
        done: true,
        viewScoreImage: false, //显示分数的图片
        openGId: '',
        politician: false, // 敏感
        posterConfig: '',
        msImageUrl: '/images/defaultResult.png' //上传到微软服务器的图片地址
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

    onPosterSuccess(e) {
        const { detail } = e;
        wx.saveImageToPhotosAlbum({
            filePath: detail,
            success: function () {
                wx.showToast({
                    title:'已保存到相册',
                    icon: 'success_no_circle'
                })
            },
            fail:function(){
                wx.showToast({
                    title:'鉴定报告下载失败',
                    icon: 'warn'
                })
            }
        })
    },

    onPosterFail(err) {
        console.error(err);
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

    // 异步生成海报
    onCreatePoster() {
        let posterConfig = {
            width: 750,
            height: 1334,
            backgroundColor: '#fff',
            debug: false,
            blocks: [
                {
                    width: 690,
                    height: 910,
                    x: 30,
                    y: 153,
                    borderWidth: 2,
                    borderColor: '#f0c2a0',
                    borderRadius: 20,
                },
                {
                    width: 634,
                    height: 104,
                    x: 59,
                    y: 933,
                    backgroundColor: '#fff',
                    opacity: 0.7,
                    zIndex: 100,
                },
            ],
            texts: [
                {
                    x: 30,
                    y: 73,
                    baseLine: 'top',
                    text: '颜值鉴定报告',
                    fontSize: 38,
                    color: '#080808',
                },
                {
                    x: 92,
                    y: 950,
                    fontSize: 30,
                    baseLine: 'middle',
                    text: this.data.text,
                    width: 570,
                    lineNum: 2,
                    lineHeight:40,
                    color: '#000',
                    zIndex: 200,
                },
                {
                    x: 360,
                    y: 1125,
                    baseLine: 'top',
                    text: '颜值PK王',
                    fontSize: 38,
                    color: '#080808',
                },
                {
                    x: 360,
                    y: 1183,
                    baseLine: 'top',
                    text: '谁才是真正的颜值之王',
                    fontSize: 28,
                    color: '#929292',
                },
            ],
            images: [
                {
                    width: 634,
                    height: 845,
                    x: 59,
                    y: 190,
                    url: this.data.msImageUrl,
                },
                {
                    width: 220,
                    height: 220,
                    x: 92,
                    y: 1080,
                    url: '/images/logo.jpg',
                }
            ]
        }

        this.setData({ posterConfig: posterConfig }, () => {
            Poster.create(true);    // 入参：true为抹掉重新生成 
        });
    },


    // 上传图片
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

                        that.setData({
                            scoreImage: e.data.content.imageUrl,
                            text: e.data.content.text,
                            msImageUrl: imageUrl
                        })

                        // 敏感图片
                        // if (e.data.content.metadata.AnswerFeed.indexOf("PoliticianImage") >= 0) {

                        //     that.setData({
                        //         politician: true,
                        //         scoreImage: e.data.content.imageUrl
                        //     })

                        // } else if (e.data.content.metadata.face) {

                        //     that.setData({
                        //         scoreImage: e.data.content.imageUrl,
                        //     })

                        // } else {

                        // }
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
                this.data.scoreImage
            ] // 需要预览的图片http链接列表
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '不好意思，颜值高就是可以为所欲为',
            path: '/pages/rank/rank',
            imageUrl: ''
        };
    }
})