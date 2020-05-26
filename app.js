//app.js
App({
  onLaunch() {
    wx.login({
      success(res) {
        // 存储当前用户code值
        var code = res.code;
        // 判断用户有没有授权
        wx.getSetting({
          success(userSuc) {
            var userSucr = userSuc.authSetting['scope.userInfo'];
            // = true就是授权了
            console.log(userSucr);
            if (userSucr) {
              wx.setStorage({
                data: userSucr,
                key: 'UserState',
              })

              wx.setStorage({
                data: false,
                key: 'UserXinXi',
              })

            } else {
              // 获取用户信息
              wx.getUserInfo({
                success(res) {
                  console.log(res)
                  // 可以将 res 发送给后台解码出 unionId
                  getApp().globalData.userInfo = res.userInfo
                },
                fail() {}
              })
            }
          }
        })
      }
    })

    wx.setStorage({
      data: false,
      key: 'UserState',
    })
  },



  globalData: {
    userInfo: null,
    code: null
  },
  resSuccess() {
    wx.showToast({
      title: '请求中',
      icon: 'loading',
      mask: true
    })
  },

  resOkay() {
    wx.hideToast()
  },
  // 服务器请求成功
  requestSussess() {
    wx.showToast({
      title: '请求数据成功！',
      icon: 'success'
    })
  },
  // 服务器请求失败
  requestFail() {
    wx.showToast({
      title: '请求服务器失败',
      icon: 'none'
    })
  }
})