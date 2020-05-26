let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    main: 0,
    // 默認页数
    page: 1,
    //  開始顯示
    shareFlag: true,
    //  轮播数据初始化
    swiper: [],
    // 五大道航
    Nav: [],
    //  产品
    product: []
  },
  // 房源资讯
  information() {
    wx.navigateTo({
      url: '../consultation/consultation',
    })
  },
  // 点击搜索进入页面
  search() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  // 点击进入详情页
  listDetail(e) {
    // 存儲當前楼盘id
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../list_detail/list_detail?id=' + id,
    })
  },
  // 点击进入下一个页面
  navListFun(e) {
    // 获取当前导航名称
    var title = e.currentTarget.dataset.title;
    console.log(title)
    // 获取当前的点击导航下标
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../list/list?id=' + id + '&title=' + title,
    })

  },
  //  点击隐藏分享
  closeFun() {
    let that = this;
    that.setData({
      shareFlag: !this.data.shareFlag
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    that.name();
    // 首頁请求
    that.indexRe();
    // 请求楼盘列表
    that.getDataLists();
  },

  name() {
    var that = this;
    wx.request({
      url: httpUrl.requestUrl + requestUrl.Name,
      method: "POST",
      success(res) {
        console.log(res);
        wx.setNavigationBarTitle({
          title: res.data
        })
      }
    })

  },

  // 首页请求
  indexRe() {
    let that = this;
    wx.request({
      url: httpUrl.requestUrl + requestUrl.index,
      method: "POST",
      success: function (res) {
        app.resSuccess();
        that.setData({
          swiper: res.data.banners,
          Nav: res.data.fenLeis,
          messages: res.data.messages
        })
      },
      fail(res) {
        app.requestFail();
      },
      complete() {
        app.resOkay();
      }
    });

  },

  // 看到页面时执行
  onShow() {

  },

  // 请求楼盘下拉列表
  getDataLists() {
    let that = this;  
    wx.request({
      url: httpUrl.requestUrl + requestUrl.indexProduct,
      method: "post",
      data: {
        pageNo: that.data.page
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        that.setData({
          product: [...that.data.product, ...res.data.list],
          main: res.data.totalPage
        })
      },
      fail(res) {
        app.requestFail();
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.indexRe();
    that.name();
    setTimeout(function () {
      if (that.data.page == 1) {
      } else {
        that.getDataLists();
      }
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (that.data.page > that.data.main) {
      wx.showToast({
        title: '加载完毕',
        icon: 'none'
      })
    } else {
      that.setData({
        page: that.data.page + 1
      })
      that.getDataLists();
    }
  }
})