// pages/activation/activation.js+
let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.jihuo();
  },
  // 待激活
  jihuo() {
    var userid = wx.getStorageSync('UserId');
    var that = this;
    wx.request({
      url: httpUrl.requestUrl + requestUrl.daiJiHuo,
      method: 'post',
      data: {
        userid: userid,
        pageNo: 1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log(res);
        var time = res.data.mingXiList;
        var timeArr = [];
        for (var i = 0; i < time.length; i++) {
          var Times = time[i].shijian;
          var Datetime = new Date(Times);
          var timeZhuan = Datetime.getFullYear() + '-' + (Datetime.getMonth() + 1) + '-' + Datetime.getDate() + ' ' + Datetime.getHours() + ':' + Datetime.getMinutes() + ':' + Datetime.getSeconds();;
          timeArr.push(timeZhuan);
          console.log(timeArr)
        }
        that.setData({
          loulist: res.data.mingXiList,
          shijian: timeArr
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