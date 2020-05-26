// pages/not_visited/not_visited.js
let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    zt: "",
    id: "",
    // 预计到店
    multiArray: [years, months, days, hours, minutes],
    multiIndex: [0, 9, 16, 10, 17],
    choose_year: '',
    time: "选择到访时间",
    // 默认上传图片
    UpImg: '../image/add.png',
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
              UpImg: jsonstr.url
            })
          }
        })

      },
      complete() {
        wx.hideLoading();
      }
    })
  },


  formSub(e) {
    var time = this.data.date;
    var id = this.data.id;
    var img = this.data.UpImg;
    if (img == '../image/add.png') {
      wx.showToast({
        title: '上传访单',
        icon: 'none'
      })
      return;
    } else if (this.data.time == '选择到访时间') {
      wx.showToast({
        title: '选择到访时间',
        icon: 'none'
      });
      return;
    } else {

      wx.request({
        url: httpUrl.requestUrl + requestUrl.yuYue,
        data: {
          daofangshijian: time,
          daofangdan: img,
          id: id,
          zhuangtai: 1
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success(res) {
          wx.showToast({
            title: '提交中',
            icon: 'loading'
          })
          console.log(res);
        },
        complete(res) {
          setTimeout(function () {
            wx.showToast({
              title: '提交完成',
              icon: 'success'
            })
          }, 2000)
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e);
    var name = e.name;
    var zt = e.zt;
    var id = e.id;

    //设置默认的年份
    this.setData({
      choose_year: this.data.multiArray[0][0],
      name: name,
      zt: zt,
      id: id
    })
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
    // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    var time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    var date = new Date(time);
    this.setData({
      time: time,
      date: date
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
})