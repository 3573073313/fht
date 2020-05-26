// pages/consultation_detail/consultation_detail.js
let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");
// 时间转换
let dateTime = require("../../utils/dateTime.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.ListDetail(e);
  },

  // 数据请求
  ListDetail(e) {
    let that = this;
    wx.request({
      url: httpUrl.requestUrl + requestUrl.ListDetail,
      data: {
        id: e.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success(res) {
        console.log(res)
        var arr = res.data.date;
        var tiems =  dateTime.tsFormatTime(arr, 'Y/M/D');
        console.log(arr)
        that.setData({
          title: res.data.name,
          date: tiems,
          value: res.data.value.replace(/\<img/gi, '<img style="max-width:100%;height:auto"'),
        })
      },
      fail(res) {
        console.log(res)
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

})