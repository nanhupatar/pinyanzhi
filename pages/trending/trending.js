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
        // that.loadImages();
      }
    });
  },

  onShow: function() {
    col1H=0;
    col2H = 0;
    
    this.setData({
      col1: [],
      col2: [],
      pageNum: 1,
      totalPage: 2,
      loadingCount: 0,
      images:[]
    },()=>{
      this.loadImages();
    });
  },

  formateImages: function(list) {
    for (let i = 0; i < list.length; i++) {
      list[i].height = 0;
    }

    return list;
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
      if (img.fileId === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

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
      col1: col1,
      col2: col2
    };

    this.setData(data);
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

          imageList = that.formateImages(imageList);
          console.log(imageList);
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
  goDetail:function(e) {
    const fileId = e.currentTarget.dataset.item.fileId;
    wx.navigateTo({
      url: '../detail/detail?fileId='+fileId
    })
  }
});
