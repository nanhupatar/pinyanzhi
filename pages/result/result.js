// pages/result/result.js
var app = getApp();
var config = require("../../utils/config.js");
var imageProcess = require("../../utils/imageProcess.js");
import Poster from "../../components/wxa-plugin-canvas/poster/poster";
var PosterConfig = require("../../config/posterDefaultConf.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    image: "/images/defaultResult.png",
    scoreImage: "",
    text: "我这么美，我这么美，我怎么这么美~~",
    done: true,
    viewScoreImage: false, //显示分数的图片
    openGId: "",
    politician: false, // 敏感
    posterConfig: "",
    msImageUrl: "/images/defaultResult.png", //上传到微软服务器的图片地址
    openId: wx.getStorageSync("openId"),
    onsharing:false,
    fileId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
    wx.updateShareMenu({
      withShareTicket: true
    });
    // 初次登陆，获取最近上传的照片
    this.getLatestImage();

    // if (options.imagePath) {
    //   this.processImage(options.imagePath);
    // }
  },

  onShow() {
    // this.getLatestImage();
  },

  getLatestImage() {
    let that = this;

    wx.cloud.callFunction({
      // 云函数名称
      name: "getLatestImage",
      // 传给云函数的参数
      success(res) {
        console.log("获取最新上传的图片", res);
        if(res.result.data.length>0){
          let result = res.result.data[0];
          let fileId = result.fileId;
          wx.cloud.downloadFile({
            fileID: fileId
          }).then(res => {  
  
            console.log(res.tempFilePath);
            let imagePath = res.tempFilePath;
            that.setData({
              done: true,
              scoreImage:result.msxiaobingUrl,
              text:result.text,
              image:fileId,
              msImageUrl:result.base64Url,
              fileId:fileId
            })
          })
        }
      },
      fail: console.error
    });
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
    // wx.previewImage({
    //   urls: [detail]
    // });
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
    console.log("图片加载完毕");
  },

  scoreImageLoadedError() {
    var that = this;
    that.setData({
      done: true,
      text: "颜值计算失败，请重新操作~"
    });
  },

  // 异步生成海报
  onCreatePoster() {
    let that = this;

    let posterConfig = PosterConfig.posterConfig;
    posterConfig.texts[1].text = that.data.text;
    posterConfig.images[0].url = that.data.msImageUrl;
    this.setData({ posterConfig: posterConfig }, () => {
      Poster.create(true); // 入参：true为抹掉重新生成
    });
  },

  // 上传图片
  uploadImage: function(event) {
    var that = this;
    wx.getUserInfo({
      success: res => {
        wx.setStorageSync("userInfo", res.userInfo);
      }
    });

    wx.chooseImage({
      count: 1,
      sourceType: ["album", "camera"],
      sizeType: ["compressed"],
      success: function(data) {
        var image = data.tempFiles[0];
        wx.getImageInfo({
          src: image.path,
          success: function(res) {
            if (image.size < config.imageSize) {
              that.processImage(res, image.path);
            } else {
              wx.showToast({
                title: "文件太大",
                image: "/images/warning-circle-o.png"
              });
            }
          },
          fail: function(e) {
            console.log("获取图片信息失败", e);
          }
        });
      },
      fail: function(e) {
        console.log("取消选择图片", e);
      }
    });
  },

  // 获取时间戳
  getTimestamp() {
    return new Date().getTime();
  },

  // 上传图片
  uploadImgToCloud(imgInfo, imagePath) {
    const path =
      this.data.openId + "_" + this.getTimestamp() + "." + imgInfo.type;

    return wx.cloud.uploadFile({
      cloudPath: path, // 上传至云端的路径
      filePath: imagePath // 小程序临时文件路径
    });
  },

  // 上传报告 imageInfo图片信息, FileId上传文件id , text小冰报告
  uploadReportInfo(imageInfo,fileId, text, msUrl,base64Url) {
    let that = this;
    const userInfo = wx.getStorageSync("userInfo");
    wx.cloud.callFunction({
      // 云函数名称
      name: "uploadMsReport",
      data: {
        imageInfo:imageInfo,
        score: that.getScore(text),
        fileId: fileId,
        text: text,
        msxiaobingUrl: msUrl,
        user: userInfo,
        base64Url:base64Url
      },
      // 传给云函数的参数
      success(res) {
        console.log("云数据同步成功", res);
        that.setData({fileId:fileId});
      },
      fail: console.error
    });
  },

  // 获取分数
  getScore(text) {
    return +text.match(/\d+(.\d+)?/g)[0];
  },

  // 处理图片
  processImage(imageInfo, imagePath) {
    var that = this;
    that.setData({
      image: imagePath,
      hideShare: true,
      text: "",
      done: false,
      showScoreImage: false,
      politician: false // 敏感
    });
    imageProcess.processingImage(that, app.globalData.screenInfo.width, 1000);
    wx.uploadFile({
      url: "https://mediaplatform.msxiaobing.com/Image/Upload",
      filePath: imagePath,
      name: "file",
      header: {
        "content-tyep": "multipart/form-data"
      },
      success: function(res) {
        console.log("上传图片", res);

        if (200 != res.statusCode) {
          that.setData({
            text: "颜值计算失败，请重新操作~",
            done: true
          });
          return;
        }

        var res = JSON.parse(res.data),
          imageUrl = res.Host + res.Url,
          tid = imageProcess.makeTid(),
          validate = imageProcess.EncryptDateTimeForImageProcess();

        wx.request({
          url:
            "https://minisite-skill.msxiaobing.com/Api/ImageAnalyze/Process?service=CSYanzhiWeApp" +
            "&tid=" +
            tid +
            "&validate=" +
            validate,
          header: {
            "content-type": "application/json"
          },
          method: "POST",
          data: {
            Content: {
              ImageUrl: imageUrl
            }
          },
          success: function(e) {
            console.log("请求分数", e);

            that.setData({
              scoreImage: e.data.content.imageUrl,
              text: e.data.content.text,
              msImageUrl: imageUrl
            });

            if (e.data.content.metadata.face) {
              that.uploadImgToCloud(imageInfo, imagePath).then(res => {
                console.log(res);
                const fileId = res.fileID;
                that.uploadReportInfo(
                  imageInfo,
                  fileId,
                  e.data.content.text,
                  e.data.content.imageUrl,
                  imageUrl
                );
              });
            }
          },
          fail: function(e) {
            that.setData({
              text: "颜值计算失败，请重新操作~",
              done: true
            });
          }
        });
      },
      fail: function(e) {
        that.setData({
          text: "颜值计算失败，请重新操作~",
          done: true
        });
      }
    });
  },

  previewImage: function() {
    // 预览图片
    wx.previewImage({
      urls: [this.data.image] // 需要预览的图片http链接列表
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this;
    return {
      title: that.data.text,
      path: "/pages/detail?fileId="+that.data.fileId,
      imageUrl: that.data.msImageUrl
    };
  }
});
