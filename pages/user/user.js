// pages/user/user.js
let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userZt: null,
    code: "",
    userInfo: "",
    userCanshu: null,
    zhuangtai: null,
    loginid: ""
  },


  // 点击完善信息进入
  evpiFun() {
    wx.navigateTo({
      url: '../evpi/evpi',
    })
  },

  // 点击个人信息
  UserInfPage() {
    var that = this;
    if (!this.data.userCanshu) {
      wx.showToast({
        title: '请授权',
        icon: 'none'
      })
      return;
    }

    if (that.data.zhuangtai == false) {
      wx.showToast({
        title: '请完善信息',
        icon: 'none'
      })
      return;
    } else {
      wx.navigateTo({
        url: '../user_information/user_information',
      })
    }



  },


  // 点击获取用户信息
  GetUserInfo(e) {
    // wx.get
    console.log(e);
    var userinfo = e.detail.userInfo;

    wx.login({
      success: resUser => {
        var that = this;
        wx.request({
          url: httpUrl.requestUrl + requestUrl.LoginUsers,
          data: {
            code: resUser.code,
            userInfo: userinfo,
            userid: that.data.loginid
          },
          success(res) {
            console.log(res);
            wx.setStorage({
              data: true,
              key: 'UserState',
            })

            wx.setStorage({
              data: userinfo,
              key: 'UserInfo',
            })

            wx.setStorage({
              data: res.data.item.id,
              key: 'UserId',
            })

            that.setData({
              jine: res.data.item.tixianjine,
              daijihuo: res.data.item.dongjiejine,
              nicheng: res.data.item.nicheng,
              touxiang: res.data.item.touxiang
            })

            that.onShow();

            wx.getStorage({
              key: 'UserId',
              success(res1) {
                var userid = res1.data;
                app.resSuccess();

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
                      username: res.data.user.nicheng,
                      shouji: res.data.user.shoujihao,
                      leixing: res.data.user.yixiangleixings,
                      quyu: res.data.user.yixiangquyu,
                      jine: res.data.user.tixianjine,
                      daijihuo: res.data.user.dongjiejine
                    })
                  },
                  complete() {
                    app.resOkay();
                  }
                })
              }
            })

          }
        })
      }
    })


  },
  // 
  reflectFun(e) {
    var jine = e.currentTarget.dataset.jine;
    // console.log(e);
    wx.navigateTo({
      url: '../reflect/reflect?jine=' + jine,
    })
  },

  // 待激活
  activaion() {
    wx.navigateTo({
      url: '../activation/activation',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;


    wx.getStorage({
      key: 'Loginid',
      success(res) {
        var loginid = res.data;
        that.setData({
          loginid: loginid
        })
      }
    })

    console.log(that.data.loginid)


    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    wx.getStorage({
      key: 'UserState',
      success(ress) {
        console.log(ress.data);
        that.setData({
          userCanshu: ress.data
        })
      }
    })

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
              username: res.data.user.nicheng,
              shouji: res.data.user.shoujihao,
              leixing: res.data.user.yixiangleixings,
              quyu: res.data.user.yixiangquyu,
              jine: res.data.user.tixianjine,
              daijihuo: res.data.user.dongjiejine,
              zhuangtai: res.data.user.bool
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
  // 点击进入资金明细
  capital() {
    wx.navigateTo({
      url: '../capital/capital',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this;
    wx.getStorage({
      key: 'UserXinXi',
      success(res) {
        console.log(res)
        that.setData({
          userZt: res.data
        })
      }
    })
    that.onLoad();

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