// pages/detail/detail.js
import Poster from "../../components/wxa-plugin-canvas/poster/poster";
var PosterConfig = require("../../config/posterDefaultConf.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileId: '',
    done: false,
    imageInfo: '',
    storeImagePath: '',
    posterConfig: '',
    windowWidth:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        this.setData({
          windowWidth:ww
        });
      }
    });
    if (options.fileId) {
      this.getImageReport(options.fileId);
    }
  },

  getImageReport(fileId) {
    let that = this;
    wx.showLoading({
      title: '加载中'
    })
    wx.cloud.callFunction({
      name: "getImageReport",
      data: {
        fileId: fileId
      },
    }).then(res => {
      let imageInfo = res.result.data[0];
      wx.cloud.downloadFile({
        fileID: imageInfo.fileId
      }).then(res => {
        that.setData({
          imageInfo: imageInfo,
          done: true,
          storeImagePath: res.tempFilePath
        });
        console.log(res.tempFilePath)
        wx.getImageInfo({
          src: res.tempFilePath,
          success: function(res) {
            console.log(res)
          }
        });
        wx.hideLoading();
      }).catch(error => {
      })
    })
  },

  backToResult: function () {
    wx.switchTab({
      url: '/pages/result/result'
    })
  },

  onShareAppMessage: function () {
    let that = this;
    return {
      title: that.data.imageInfo.text,
      path: "/pages/detail/detail?fileId="+that.data.imageInfo.fileId,
      imageUrl: that.data.imageInfo.base64Url
    };
  },
  onPosterFail(err) {
    console.error(err);
  },
  onPosterSuccess(e) {
    const { detail } = e;
    wx.saveImageToPhotosAlbum({
      filePath: detail,
      success: function() {
        wx.showToast({
          title: "已保存到相册",
          icon: "none"
        });
      },
      fail: function() {
        wx.showToast({
          title: "下载失败",
          icon: "warn"
        });
      }
    });
  },
  // 异步生成海报
  onCreatePoster: function () {
    let that = this;
    console.log(that.data.storeImagePath)

    let posterConfig = PosterConfig.posterConfig;
    posterConfig.texts[1].text = that.data.imageInfo.text;
    posterConfig.images[0].url = that.data.imageInfo.base64Url;
    this.setData({ posterConfig: posterConfig }, () => {
      Poster.create(true); // 入参：true为抹掉重新生成
    });
  },


})