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
    pageNum: 1,
    totalPage: 2
  },

  onLoad: function() {
    let that = this;
    col1H = 0;
    col2H = 0;
    that.setData({
      col1: [],
      col2: []
    });

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
        that.loadImages();
      }
    });
  },

  loadImages: function() {
    let that = this;
    // 加载到底了
    if (that.data.pageNum <= that.data.totalPage) {
      wx.cloud.callFunction({
        // 云函数名称
        name: "getTrending",
        // 传给云函数的参数
        data: {
          pageNum: that.data.pageNum,
          pageSize: 10
        },
        success(res) {
          console.log("获取排行版数据", res);
          let result = res.result;
          let imageList = that.data.images.concat(result.data);
          that.setData({
            images: imageList,
            loadingCount: imageList.length,
            pageNum: that.data.pageNum + 1,
            totalPage: result.totalPage
          });
        },
        fail: console.error
      });
    }
  },

  previewImg: function(e) {
    const fileId = e.currentTarget.dataset.item.fileId;
    wx.previewImage({
      urls: [fileId]
    });
  },

  // 跳转至页面详情
  goDetail: function(e) {
    const fileId = e.currentTarget.dataset.item.fileId;
    wx.navigateTo({
      url: "../detail/detail?fileId=" + fileId
    });
  }
});
