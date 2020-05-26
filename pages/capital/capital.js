// pages/capital/capital.js
let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ArrList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.ziJinMingXi();
  },

  // 获取资金明细
  ziJinMingXi() {
    var that = this;
    wx.getStorage({
      key: 'UserId',
      success(res) {
        var userid = res.data;
        wx.request({
          url: httpUrl.requestUrl + requestUrl.ziJinMingXi,
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
            var arrTime = res.data;
            var arrDateTime = [];
            for (var i = 0; i < arrTime.length; i++) {
              console.log(arrTime[i].date)
              var DateTime = new Date(arrTime[i].date);
              var y = DateTime.getFullYear();
              var m = DateTime.getMonth() + 1;
              var d = DateTime.getDate();
              var h = DateTime.getHours();
              var mm = DateTime.getMinutes();
              var s = DateTime.getSeconds();
              var timesArr = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
              arrDateTime.push(timesArr);
              console.log(timesArr)
            }
            that.setData({
              ArrList: res.data,
              arrTime: arrDateTime
            })
          }
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