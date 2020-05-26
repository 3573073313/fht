// pages/user_information/user_information.js
let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: "历下区"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.getStorage({
      key: 'UserId',
      success(res1) {
        var userid = res1.data;
        wx.request({
          url: httpUrl.requestUrl + requestUrl.UserHuoqu,
          method: 'POST',
          data: {
            id: userid
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success(res) {
            console.log(res);
            that.setData({
              userimg: res.data.user.touxiang,
              username: res.data.user.xingming,
              shouji: res.data.user.shoujihao,
              leixing: res.data.user.yixiangleixings,
              quyu: res.data.user.yixiangquyu,
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

  UpdateFun(e) {
    console.log(e);
    var name = e.currentTarget.dataset.name;
    var phones = e.currentTarget.dataset.phone;
    wx.navigateTo({
      url: '../change_evpi/change_evpi?name=' + name + "&phone=" + phones,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
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