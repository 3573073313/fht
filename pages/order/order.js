// pages/order/order.js
let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 初始化访问列
    appointment: []
  },
  xiangqing(e) {
    console.log(e);
    wx.navigateTo({
      url: '../list_detail/list_detail?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    wx.getStorage({
      key: 'UserId',
      success(res) {
        var userids = res.data;
        wx.request({
          url: httpUrl.requestUrl + requestUrl.yuYueList,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            userid: userids
          },
          success(res) {
            // 到访时间
            var ArrList = res.data;
            var yuyueArrTime = [];
            var daofangArrTime = [];
            var chengjiaoArrTime = [];
            console.log(res)
            for (var i = 0; i < ArrList.length; i++) {
              console.log(ArrList)
              var yuyueTime = ArrList[i].shijian;
              var arrTime = new Date(yuyueTime);
              var m = arrTime.getMonth() + 1;
              var d = arrTime.getDate();
              var h = arrTime.getHours();
              var mm = arrTime.getMinutes();
              var yuyueTimeArr = m + "-" + d + " " + h + ":" + mm;
              yuyueArrTime.push(yuyueTimeArr)
            }

            for (var a = 0; a < ArrList.length; a++) {
              var daofangTime = ArrList[a].daofangshijian;
              var arrTime = new Date(daofangTime);
              var m = arrTime.getMonth() + 1;
              var d = arrTime.getDate();
              var h = arrTime.getHours();
              var mm = arrTime.getMinutes();
              var daofang = m + "-" + d + " " + h + ":" + mm;
              daofangArrTime.push(daofang);
            }

            for (var n = 0; n < ArrList.length; n++) {
              var chengjiaoTime = ArrList[n].changjiaoshijian;
              var arrTime = new Date(chengjiaoTime);
              var m = arrTime.getMonth() + 1;
              var d = arrTime.getDate();
              var h = arrTime.getHours();
              var mm = arrTime.getMinutes();
              var chengjiaoTimeArr = m + "-" + d + " " + h + ":" + mm;
              chengjiaoArrTime.push(chengjiaoTimeArr);
              console.log(chengjiaoArrTime)
            }

            that.setData({
              appointment: res.data,
              yuyueTime: yuyueArrTime,
              daofangTime: daofangArrTime,
              chengjiaoTime: chengjiaoArrTime
            })
          }
        })
      }
    })
  },
  // 成交
  daichengjiao(e) {
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../not_deal/not_deal?name=' + name + '&id=' + id,
    })
  },

  sousuo(e) {
    console.log(e);
    var name = e.detail.value;
    var that = this;
    wx.getStorage({
      key: 'UserId',
      success(res) {
        var userids = res.data;
        wx.request({
          url: httpUrl.requestUrl + requestUrl.yuYueList,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            loupanming: name
          },
          success(res) {
            console.log(res);
            that.setData({
              appointment: res.data
            })
          }
        })
      }
    })
  },

  //queren
  queren(e) {
    console.log(e);
    var name = e.currentTarget.dataset.name;
    var zt = e.currentTarget.dataset.zt;
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../not_visited/not_visited?name=' + name + '&zt=' + zt + '&id=' + id,
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
    this.onLoad();
  },

})