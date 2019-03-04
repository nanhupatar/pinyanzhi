let col1H = 0;
let col2H = 0;

Page({
  data: {
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    pageNum: 0
  },

  onLoad: function() {
    let that = this;
    wx.getSystemInfo({
      success: res => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });
      }
    });
  },

  onShow: function() {
    let that = this;
    this.setData({
      pageNum: 0
    });
    that.loadImages();
  },

  formateImages: function(list) {
    for (let i = 0; i < list.length; i++) {
      list[i].height = 0;
    }
    this.setData({
      images: list,
      loadingCount: list.length
    });
    // console.log(list)
  },

  onImageLoad: function(e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = this.data.imgWidth; //图片设置的宽度
    let scale = imgWidth / oImgW; //比例计算
    let imgHeight = oImgH * scale; //自适应高度

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img._id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    this.setData(data);
  },

  loadImages: function() {
    let that = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: "getTrending",
      // 传给云函数的参数
      data: {
        pageNum: that.data.pageNum
      },
      success(res) {
        console.log("获取排行版数据", res);
        that.setData({
          images: res.result.data,
          loadingCount: res.result.data.length,
          pageNum: that.data.pageNum + 1
        });
      },
      fail: console.error
    });
  },

  previewImg: function(e) {
    const fileId = e.currentTarget.dataset.item.FileId;
    console.log(fileId);
    wx.previewImage({
      urls: [fileId]
    });
  }
});
