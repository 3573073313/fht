// pages/search/search.js
let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 搜索查询
  inputSucc(e) {
    //将input里面输入的值存贮起来
    var value = e.detail.value;
    var that = this;
    if (value == "") {
      that.setData({
        product: false
      })

    } else {
      wx.request({
        url: httpUrl.requestUrl + requestUrl.TwoIndex,
        data: {
          name: value
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success(res) {
          console.log(res);
          that.setData({
            product: res.data.list
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 点击进入详情页
  listDetail(e) {
    // 存儲當前楼盘id
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../list_detail/list_detail?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})