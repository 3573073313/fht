// pages/consultation/consultation.js
let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");
// 时间转换
let dateTime = require("../../utils/dateTime.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: [],
    // 默认当前页数
    pages: 1,
    maxle: 0,
    louList: []
  },

  // 點擊跳轉詳情頁面
  DetailFun(e) {
    var id = e.currentTarget.dataset.id
    console.log(e)
    wx.navigateTo({
      url: "../consultation_detail/consultation_detail?id=" + id,
    })
  },

  // 请求咨询列表
  RequestList(e) {
    let that = this;
    wx.request({
      url: httpUrl.requestUrl + requestUrl.consultationList,
      data: {
        pageNo: that.data.pages
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var Arrlist = res.data;
        var time = that.data.time;
        var page = that.data.pages;
        console.log(page)
        var ArrList = that.data.louList.concat(res.data);
        //  循环里面的时间
        for (var i = 0; i < Arrlist.length; i++) {
          let timeArr = dateTime.tsFormatTime(Arrlist[i].date, 'Y/M/D');
          time.push(timeArr);
          that.setData({
            time: time,
          })
        };
        that.setData({
          louList: ArrList,
          maxle: res.data.length
        });
        console.log(res)
      },
      fail(res) {
        console.log("请求失败")
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.RequestList();
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
    let that = this;
    setTimeout(function () {
      that.RequestList();
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    var page = that.data.pages + 1;
    var maxle = that.data.maxle;
    console.log(page)
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    if (maxle == 0) {
      wx.showToast({
        title: '加载完毕',
        icon: 'none'
      })
    } else {
      var list = that.data.louList;
      console.log(list)
      that.setData({
        pages: page + 1, // 更新当前分页数,
      });
      that.RequestList();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})