// pages/photo/photo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollH:0,
    done:false,
    images:[],
    pageNum:1,
    totalPage:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH
        });
      }
    });
  },

  onShow:function(){
    this.setData({
      images: [],
      pageNum: 1,
      totalPage: 2
    })
    this.loadImages();
  },

  loadImages:function(){
    let that =this;
    if(that.data.pageNum<=that.data.totalPage){
      wx.cloud.callFunction({
        name: 'getPhoto',
        data: {
          pageSize: 20,
          pageNum: 1
        }
      }).then(res => {
        console.log('获取相册', res)
        let result = res.result;
        let images = that.data.images.concat(result.data);
        that.setData({
          pageNum: result.pageNum + 1,
          images: images,
          totalPage: result.totalPage,
          done: true
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },

  deleteImage:function(e){
    let that = this;
    let imageInfo = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    console.log(imageInfo);
    wx.cloud.callFunction({
      name:'delImage',
      data:{
        id:imageInfo._id
      }
    }).then(res=>{
      console.log(res)
      wx.showToast({
        title: '已删除',
      });
      let images = JSON.parse(JSON.stringify(that.data.images))
      images.splice(index,1);
      that.setData({
        images:images
      })
    }).catch(err=>{
      console.log(err)
    })
  },
  goDetail:function(e){
    let imageInfo = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/detail/detail?fileId='+imageInfo.fileId,
    })
  }
})