// pages/reflect/reflect.js
let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    BankIndex: 0,
    Bankid: 1,
    BankList: [],
    // 最大取值
    minPeople: 200,
    // 初始化支付宝
    zPayName: '',
    zPayPeople: '',
    // 初始化银行卡
    uPaySon: '',
    uPayName: '',
    uPayNum: '',
    Userid: '',
    // 默认上传图片
    fileImg: '../image/add.png',
    // 初始化金额数值
    jine: '',
    // 虚拟总金额
    people: null,
    // 默认选中当前
    PayIndex: 0,
    Checked: true,
    tupian: null,
    payList: [{
      payListTxt: "微信",
      payListImg: "../image/pay/wechatPay.png",
      radio: true
    }, {
      payListTxt: "支付宝",
      payListImg: "../image/pay/Alipay.png",
      radio: false
    }, {
      payListTxt: "银行卡",
      payListImg: "../image/pay/unionPay.png",
      radio: false
    }]
  },
  // 银行触发
  BankFun(e) {
    console.log(e);
    this.setData({
      Bankid: e.detail.value,
      BankIndex: e.detail.value
    })
    this.BankList();
  },
  // 获取银行列表
  BankList() {
    var that = this;
    wx.request({
      url: httpUrl.requestUrl + requestUrl.bankList,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log(res)
        var id = res.data[that.data.BankIndex].id;
        var bank = res.data;
        var banksArr = [];
        for (var i = 0; i < bank.length; i++) {
          var banks = bank[i].name;
          banksArr.push(banks);
        }
        that.setData({
          BankList: banksArr,
          Bankid: id
        })
      }



    })
  },

  // 微信提现
  weChat() {
    var that = this;
    wx.request({
      url: httpUrl.requestUrl + requestUrl.tiXian,
      method: "POST",
      data: {
        userid: that.data.Userid,
        leixing: 2,
        tupian: that.data.tupian,
        jine: that.data.jine
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var success = res.data.success;
        if (success == false) {
          wx.showToast({
            title: '余额不足',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          })
        }
      }
    })
  },
  userxin() {
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
            console.log(res.data.user);
            that.setData({
              fileImg: res.data.user.weixin,
              zPayName: res.data.user.zhanghaoming,
              zPayPeople: res.data.user.zhifubaozhaohao,
              uPaySon: res.data.user.zhihang,
              uPayName: res.data.user.zhanghaoming,
              uPayNum: res.data.user.zhanghao
            })
          }
        })
      }
    })
  },
  // 支付宝
  aPay() {
    var that = this;
    wx.request({
      url: httpUrl.requestUrl + requestUrl.tiXian,
      method: "POST",
      data: {
        userid: that.data.Userid,
        leixing: 1,
        zhanghao: that.data.zPayPeople,
        yuliuxingming: that.data.zPayName,
        jine: that.data.jine
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var success = res.data.success;
        if (success == false) {
          wx.showToast({
            title: '余额不足',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 银行
  BankPay() {
    var that = this;
    wx.request({
      url: httpUrl.requestUrl + requestUrl.tiXian,
      method: "POST",
      data: {
        userid: that.data.Userid,
        leixing: 3,
        yinhangid: that.data.Bankid,
        zhihangming: that.data.uPaySon,
        yinhangka: that.data.uPayNum,
        yuliuxingming: that.data.uPayName,
        jine: that.data.jine,
        yinhangming: that.data.BankList[that.data.BankIndex]
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var success = res.data.success;
        if (success == false) {
          wx.showToast({
            title: '余额不足',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 提现明细
  withdrawal(e) {
    var userid = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '../withdrawal/withdrawal?userid=' + userid,
    })
  },
  // 输入提现金额时触发
  people(e) {
    let that = this;
    // 获取输入的最新内容
    var value = e.detail.value;
    console.log(value)
    that.setData({
      jine: value
    })
    var data = that.data.jine;
    console.log("当前输入金额：" + data)
  },

  userid() {
    var that = this;
    wx.getStorage({
      key: 'UserId',
      success(res) {
        var UserId = res.data;
        that.setData({
          Userid: UserId
        })
      }
    })
  },
  // 提交数据
  formSub(e) {
    var that = this;
    // 输入的金额
    var jines = that.data.jine;
    // 最小提现金额
    var jinemin = that.data.minPeople;
    // 当前下标
    var payIndex = that.data.PayIndex;
    if (jines == "") {
      wx.showToast({
        title: '金额不可为空',
        icon: 'none'
      })
      return;

    } else if (jines < jinemin) {
      wx.showToast({
        title: '最少200元',
        icon: 'none'
      })
      return;
    }
    if (payIndex == 0) {
      that.weChat();
    }

    // 判断选中支付宝
    if (payIndex == 1) {
      console.log("支付宝")
      if (that.data.zPayName == '') {
        wx.showToast({
          title: '收款人为空',
          icon: 'none'
        })
        return;
      }
      if (that.data.zPayPeople == '') {
        wx.showToast({
          title: '支付宝账号为空',
          icon: 'none'
        })
        return;
      }
      that.aPay();
    }

    if (payIndex == 2) {
      if (that.data.uPay == '请选择所属银行') {
        wx.showToast({
          title: '请选择银行',
          icon: 'none'
        })
        return;
      }
      if (that.data.uPaySon == '') {
        wx.showToast({
          title: '支行为空',
          icon: 'none'
        })
        return;
      }
      if (that.data.uPayName == '') {
        wx.showToast({
          title: '姓名为空',
          icon: 'none'
        })
        return;
      }
      if (that.data.uPayNum == '') {
        wx.showToast({
          title: '卡号为空',
          icon: 'none'
        })
        return;
      }
      that.BankPay();
    }


  },

  // 支付宝姓名
  zPayName(e) {
    // 获取当前输入名称
    var zPayName = e.detail.value;
    console.log(zPayName);
    this.setData({
      zPayName: zPayName
    })
  },

  zPayPeople(e) {
    // 获取当前输入账号
    var zPayPeople = e.detail.value;
    console.log(zPayPeople);
    this.setData({
      zPayPeople: zPayPeople
    })
  },


  // 银行
  uPay(e) {
    var uPay = e.detail.value;
    console.log(uPay);
    this.setData({
      uPay: uPay
    })
  },
  uPaySon(e) {
    var uPaySon = e.detail.value;
    console.log(uPaySon);
    this.setData({
      uPaySon: uPaySon
    })
  },
  uPayName(e) {
    var uPayName = e.detail.value;
    console.log(uPayName);
    this.setData({
      uPayName: uPayName
    })
  },

  uPayNum(e) {
    var uPayNum = e.detail.value;
    console.log(uPayNum);
    this.setData({
      uPayNum: uPayNum
    })
  },

  // 点击使用某种提现方式
  PayFun(e) {
    // 获取当前元素的下标
    var index = e.currentTarget.dataset.index;
    this.setData({
      PayIndex: index
    })
    // 判断是否选中
    if (this.data.PayIndex == index) {
      this.setData({
        Checked: true
      })
    } else {
      this.setData({
        Checked: false
      })
    }
  },

  // 微信上传图片
  fileUpload() {
    let that = this;
    wx.chooseImage({
      // 图片数量
      count: 1,
      // 上传图片尺寸
      sizeType: ['sizeType'],
      // 上传图片来源
      sourceType: ['album', 'camera'],
      // 成功
      success: (res) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading'
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        var imgs = tempFilePaths;
        that.setData({
          fileImg: imgs
        });
        console.log("上传成功");
        console.log(tempFilePaths);
        console.log(imgs[0]);

        wx.uploadFile({
          url: 'https://fanghuitong.vip/uploadImg', //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'imgFile',
          success(res) {
            console.log(res.data);
            var str = res.data;
            var jsonstr = JSON.parse(str);
            console.log(jsonstr)
            that.setData({
              tupian: jsonstr.url
            })
          }
        })

      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var Jine = e.jine;
    this.setData({
      people: Jine
    })
    this.BankList();
    this.userxin();
    this.userid();
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