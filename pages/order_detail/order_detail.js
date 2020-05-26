// pages/order_detail/order_detail.js
let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
const miao = [];
//获取年
for (let i = date.getFullYear(); i <= date.getFullYear() + 1; i++) {
  years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i);
};

// 获取秒
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  miao.push("" + i);
};



Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 预计到店
    multiArray: [years, months, days, hours, minutes, miao],
    multiIndex: [0, 9, 16, 10, 17, 0],
    choose_year: '',
    time: "选择预约时间",
    yuyueYes: null,
    panid: null,
    userid: "",
    datetime: "",
  },

  // 访问时间
  dateFun(e) {
    this.setData({
      date: e.detail.value
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    var id = e.id;
    console.log(e)
    that.setData({
      loupanName: e.title,
      panid: id
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
              name: res.data.user.xingming,
              phone: res.data.user.shoujihao
            })
          }
        })
      }
    })
    //设置默认的年份
    that.setData({
      choose_year: this.data.multiArray[0][0]
    })

    wx.getStorage({
      key: 'UserId',
      success(resto) {
        console.log(resto)
        var userid = resto.data;
        that.setData({
          userid: userid
        })
      }
    })

  },


  // 點擊提交數據
  formSub(e) {
    var that = this;
    if (this.data.yuyueYes) {
      wx.showToast({
        title: '不要重复预约',
        icon: 'none'
      })

      return;
    } else {
      if (this.data.time == "选择预约时间") {
        wx.showToast({
          title: '请选择预约时间',
          icon: 'none'
        })
        return;
      } else {
        wx.request({
          url: httpUrl.requestUrl + requestUrl.yuYue,
          data: {
            loupanid: this.data.panid,
            userid: this.data.userid,
            shijian: this.data.datetime
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          success(res) {
            console.log(res);
            that.setData({
              yuyueYes: res.data.success
            })
            var resStatic = res.data.success;
            if (resStatic) {
              wx.showToast({
                title: '预约成功',
                icon: 'success'
              })
            } else {
              wx.showToast({
                title: '预约失败',
                icon: 'none'
              })
            }
          }
        })
      }
    }
  },

  //获取时间日期
  bindMultiPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hour = this.data.multiArray[3][index[3]];
    const minute = this.data.multiArray[4][index[4]];
    const miao = this.data.multiArray[5][index[5]];
    // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    var DateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + miao;
    var timestamp = new Date(DateTime);
    console.log(timestamp)
    this.setData({
      time: DateTime,
      datetime: timestamp
    })
    // console.log(this.data.time);
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange: function (e) {
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      console.log(choose_year);
      this.setData({
        choose_year
      })
    }
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year);
        console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
      console.log(this.data.multiArray[2]);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
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