// pages/withdrawal/withdrawal.js
let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    var userid = e.userid;
    that.setData({
      userid: userid
    })
    that.tiXianMingXi();
  },

  // 获取明细
  tiXianMingXi() {
    var that = this;
    wx.request({
      url: httpUrl.requestUrl + requestUrl.tiXianMingXi,
      method: "POST",
      data: {
        userid: that.data.userid,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log(res);
        var time = res.data;
        var timeArr = [];
        for (var i = 0; i < time.length; i++) {
          var timeList = time[i].chuangjianshijian;
          var DateTime = new Date(timeList);
          var y = DateTime.getFullYear();
          var m = DateTime.getMonth() + 1;
          var d = DateTime.getDate();
          var h = DateTime.getHours();
          var mm = DateTime.getMinutes();
          var s = DateTime.getSeconds();
          var timesArr = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
          console.log(timesArr);
          timeArr.push(timesArr)
        }
        that.setData({
          tiXianArr: res.data,
          timeArr: timeArr
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