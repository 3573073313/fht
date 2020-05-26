// pages/evpi/evpi.js
let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg: false,
    phoneX: false,
    IndexTe: 0,
    bool: null,
    iphones: "点击获取手机号",
    chen: false,
    // 默认显示区域的下标
    multiIndex: [0, 0, 0],
    multiArray: [],
    shengindex: 0,
    shiindex: 0,
    quindex: 0,
    index: 0,
    fenLeiList: []
  },

  // 請求地址
  address() {
    var that = this;
    wx.getStorage({
      key: 'UserId',
      success(userres) {
        var id = userres.data;
        wx.request({
          url: httpUrl.requestUrl + requestUrl.UserHuoqu,
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            id: id
          },
          method: "POST",
          success(res) {
            var sheng = [];
            var shi = [];
            var qu = [];
            // 循环省
            var list = res.data.quYuList
            for (var i = 0; i < list.length; i++) {
              var quyuming = list[i].quyuming;
              sheng.push(quyuming)
            }

            // 循环市
            var lister = list[that.data.shengindex].xiaji;
            for (var e = 0; e < lister.length; e++) {
              // console.log(e, lister[e].quyuming)
              var shiming = lister[e].quyuming;
              shi.push(shiming);
            }

            // 循环区
            var ququ = list[that.data.shengindex].xiaji[that.data.shiindex].xiaji;
            for (var h = 0; h < ququ.length; h++) {
              // console.log(h, ququ[h].quyuming)
              var quList = ququ[h].quyuming;
              qu.push(quList);
            }

            that.setData({
              multiArray: [sheng, shi, qu],
              multiIndex: [that.data.shengindex, that.data.shiindex, that.data.quindex]
            })
          }
        })
      }
    })

  },

  // 点击确定
  change(e) {
    console.log(e);
    this.address();
    this.setData({
      index: e.detail.array
    })
  },

  // 滚动选择时候
  columnchange(e) {
    if (e.detail.column == 0) {
      this.setData({
        shengindex: e.detail.value
      })
    } else if (e.detail.column == 1) {
      this.setData({
        shiindex: e.detail.value
      })
    } else if (e.detail.column == 2) {
      this.setData({
        quindex: e.detail.value
      })
    }
    this.address();
  },

  // 点击获取手机号
  bindIphone(e) {
    console.log(e)
    var that = this;
    // 存储encrypdata
    var encrypdata = e.detail.encryptedData;
    // 存储iv
    var iv = e.detail.iv;
    wx.getStorage({
      key: 'UserId',
      success(resUser) {
        var userid = resUser.data;
        wx.request({
          url: httpUrl.requestUrl + requestUrl.Iphone,
          method: 'POST',
          data: {
            encrypdata: encrypdata,
            ivdata: iv,
            userid: userid
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success(res) {
            // 手机号
            var iphone = res.data.phoneNumber;
            // 中国区号
            var iphoneArea = res.data.countryCode;
            that.setData({
              iphones: iphone,
              iphoneArea: iphoneArea
            })
          }
        })
      }
    })
  },

  // 选择类型
  xuanzeFun(e) {
    console.log(e);
    // 拿到当前index下标
    var index = e.currentTarget.dataset.index;
    var fenLeiList = this.data.fenLeiList;
    fenLeiList[index].bool = !fenLeiList[index].bool;
    console.log(fenLeiList);
    this.setData({
      fenLeiList: fenLeiList
    })
  },


  // user() {
  //   var that = this;
  //   wx.getStorage({
  //     key: 'UserId',
  //     success(res1) {
  //       var userid = res1.data;
  //       wx.request({
  //         url: httpUrl.requestUrl + requestUrl.UserHuoqu,
  //         method: 'POST',
  //         data: {
  //           id: userid
  //         },
  //         header: {
  //           "Content-Type": "application/x-www-form-urlencoded"
  //         },
  //         success(res) {
  //           var yxlx = res.data.user.yixiangleixing;
  //           var yxlxZ = yxlx.split(",");
  //           console.log(yxlxZ)
  //           console.log(yxlx)
  //           that.setData({
  //             yixiangleixing: yxlxZ
  //           })
  //         }
  //       })
  //     }
  //   })
  // },

  // 点击提交


  formSubmit(e) {
    var that = this;
    console.log(e);
    // 存储姓名
    var name = e.detail.value.name;
    // 存储手机号
    var phone = e.detail.value.phone;
    // 存储选择类型
    var leixing = e.detail.value.checkbox;
    // 存储地址
    var address = e.detail.value.address;

    if (leixing.length == 0) {
      wx.showToast({
        title: '请选择类型',
        icon: 'none'
      })
      return;
    } else {
      wx.getStorage({
        key: 'UserId',
        success(res) {
          var userid = res.data;
          console.log(userid)
          wx.request({
            url: httpUrl.requestUrl + requestUrl.UserXinxi,
            method: 'POST',
            data: {
              xingming: name,
              shoujihao: phone,
              yixiangleixing: leixing,
              yixiangquyu: address,
              id: userid
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success(res) {
              console.log(res);
              wx.setStorage({
                data: true,
                key: 'UserXinXi',
              });
              wx.showToast({
                title: '完善成功',
                icon: 'success'
              })
              wx.navigateBack({
                delta: 1,
              }, 2000)
            }
          })
        }
      })
    }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    // that.user();
    var name = e.name;
    var phone = e.phone;
    that.setData({
      name: name,
      phone: phone
    })
    wx.getStorage({
      key: 'UserId',
      success(userres) {
        var id = userres.data;
        wx.request({
          url: httpUrl.requestUrl + requestUrl.UserHuoqu,
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            id: id
          },
          method: "POST",
          success(res) {
            var sheng = [];
            var shi = [];
            var qu = [];
            // 循环省
            var list = res.data.quYuList
            for (var i = 0; i < list.length; i++) {
              var quyuming = list[i].quyuming;
              sheng.push(quyuming)
            }

            // 循环市
            var lister = list[that.data.shengindex].xiaji;
            for (var e = 0; e < lister.length; e++) {
              // console.log(e, lister[e].quyuming)
              var shiming = lister[e].quyuming;
              shi.push(shiming);
            }

            // 循环区
            var ququ = list[that.data.shengindex].xiaji[that.data.shiindex].xiaji;
            for (var h = 0; h < ququ.length; h++) {
              // console.log(h, ququ[h].quyuming)
              var quList = ququ[h].quyuming;
              qu.push(quList);
            }
            that.setData({
              multiArray: [sheng, shi, qu],
              multiIndex: [that.data.shengindex, that.data.shiindex, that.data.quindex],
              yixiangleixings: res.data.user.yixiangleixings
            })
            wx.request({
              url: httpUrl.requestUrl + requestUrl.XinXiWanS,
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              success(res) {
                console.log(res)
                var list = res.data.fenLeiList;
                var yixiangleixings = that.data.yixiangleixings;


                for (var i = 0; i < list.length; i++) {
                  if (yixiangleixings.indexOf(list[i].name) >= 0) {
                    list[i].bool = true;
                  }
                }


                that.setData({
                  fenLeiList: res.data.fenLeiList,
                  bool: res.data.fenLeiList.bool,
                  fenLeiList: list,
                })
              }
            })
          }
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})