// components/notification/notification.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    setClipboard:function(){
      wx.setClipboardData({
        data: 'wx87d8c6b830c5f2c3',
        success(res) {
          wx.showToast({
            title:'已复制小程序appId到剪切板，快去关联吧',
            icon:'none',
            duration: 1500,
          });
        }
      })
    }
  }
})
