// pages/visit/visit.js

let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visitList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e);
    this.LiPin(e);
  },

  LiPin(e) {
    var that = this;
    wx.request({
      url: httpUrl.requestUrl + requestUrl.Lipin,
      method: "POST",
      data: {
        loupanid: e.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log(res)
        that.setData({
          visitList: res.data
        })
      }
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