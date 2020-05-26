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
    fenLeiList: [],
    quyuid: '',
    addid: null,
    tools: false,

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
            var quid = [];
            // 循环省
            var list = res.data.quYuList
            for (var i = 0; i < list.length; i++) {
              var quyuming = list[i].quyuming;
              sheng.push(quyuming)
            }

            // 循环市
            var lister = list[that.data.shengindex].xiaji;
            for (var e = 0; e < lister.length; e++) {
              var shiming = lister[e].quyuming;
              shi.push(shiming);
            }

            // 循环区
            var ququ = list[that.data.shengindex].xiaji[that.data.shiindex].xiaji;
            for (var h = 0; h < ququ.length; h++) {
              var quList = ququ[h].quyuming;
              qu.push(quList);
            }

            var ququarr = list[that.data.shengindex].xiaji[that.data.shiindex].xiaji;
            for (var c = 0; c < ququarr.length; c++) {
              var quyuarr = ququarr[c].id;
              quid.push(quyuarr);
            }
            console.log(quid)

            that.setData({
              multiArray: [sheng, shi, qu],
              multiIndex: [that.data.shengindex, that.data.shiindex, that.data.quindex],
              quyuid: quid
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
    var quyuid = this.data.quyuid[this.data.quindex];
    console.log(quyuid);
    this.setData({
      index: e.detail.array,
      addid: quyuid,
      tools: true
    })
    console.log(this.data.tools)
  },

  // 滚动选择时候
  columnchange(e) {
    console.log(e);
    if (e.detail.column == 0) {
      this.setData({
        shengindex: e.detail.value
      })
      console.log(0)
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
  // 选择
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
    if (name == "") {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
    } else if (phone == "点击获取手机号") {
      wx.showToast({
        title: '请获取手机号',
        icon: 'none'
      })
    } else if (leixing.length == 0) {
      wx.showToast({
        title: '请选择类型',
        icon: 'none'
      })
    } else if (that.data.tools == false) {
      wx.showToast({
        title: '请选择意向区域',
        icon: 'none'
      })
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
              id: userid,
              yixiangquyuid: that.data.addid
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
  onLoad: function (options) {
    var that = this;
    that.address();
    wx.request({
      url: httpUrl.requestUrl + requestUrl.XinXiWanS,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success(res) {
        console.log(res)
        that.setData({
          fenLeiList: res.data.fenLeiList,
          bool: res.data.fenLeiList.bool
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