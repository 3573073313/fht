let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");
var app = getApp();
// pages/list/list.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		//  产品
		product: [],
		// 初始化当前下标
		NavIndex: 0,
		shi: false,
		NavShow: false,
		shiindex: 0,
		totalPage: null,
		PageNum: 1,
		quindex: 0,
		qu: false,
		fenleiid: null,
		// 导航初始化
		nav: [{
			navTxt: "区域"
		}, {
			navTxt: "价格"
		}, {
			navTxt: "房型"
		}, {
			navTxt: "面积"
		}]
	},
	// 点击导航
	NavFun(e) {
		// 获取当前导航下标
		var index = e.currentTarget.dataset.index;
		this.setData({
			NavIndex: index,
			NavShow: !this.data.NavShow
		})
	},
	// 点击搜索
	sousuo(e) {
		var that = this;
		console.log(e);
		var name = e.detail.value;
		wx.request({
			url: httpUrl.requestUrl + requestUrl.TwoIndex,
			data: {
				name: name,
				fenleiid: that.data.fenleiid
			},
			method: "POST",
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success(res) {
				app.resSuccess();
				console.log(res);
				that.setData({
					product: res.data.list
				})
			},
			complete() {
				app.resOkay();
				wx.hideToast();
			}
		})
	},
	// 请求二级分类页下的所有产品
	ListFun(e) {
		var that = this;
		wx.request({
			url: httpUrl.requestUrl + requestUrl.TwoIndex,
			data: {
				fenleiid: that.data.fenleiid,
				pageNo: that.data.PageNum
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: "POST",
			success(res) {
				console.log(res);
				that.setData({
					product: [...that.data.product, ...res.data.list],
					totalPage: res.data.totalPage
				})
			},
			fail(res) {
				wx.showToast({
					title: '请求服务器失败',
				})
			},
			complete(res) {
				wx.hideToast({
					title: '加载完毕',
					icon: 'success'
				})
			}
		})
	},
	// 请求二级分类页面下面的广告图
	ListFunBanner() {
		var that = this;
		wx.request({
			url: httpUrl.requestUrl + requestUrl.TwoIndexBanner,
			method: "post",
			data: {
				id: that.data.fenleiid
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success(res) {
				wx.showToast({
					title: '请求中',
					icon: 'loading'
				})
				console.log(res);
				that.setData({
					tupians: res.data.guanggaotu
				})
			},
			complete(res) {
				wx.hideToast({
					title: '加载完毕',
					icon: 'success'
				})
			}
		})
	},
	// 四大类
	fourFun() {
		var that = this;
		wx.request({
			url: httpUrl.requestUrl + requestUrl.indexlouPan,
			method: "post",
			data: {
				fenleiid: that.data.fenleiid
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success(res) {
				console.log(res);
				that.setData({
					dizhi: res.data.quYuList,
					jiage: res.data.jiaGeList,
					fangxing: res.data.fangXingList,
					mianji: res.data.mianJiList
				})
			}
		})
	},

	sheng(e) {
		console.log(e)
		var indexdizhi = e.currentTarget.dataset.index;
		this.setData({
			shi: true,
			shiindex: indexdizhi
		})
	},

	shi(e) {
		console.log(e)
		var indexshi = e.currentTarget.dataset.index;
		this.setData({
			qu: true,
			quindex: indexshi
		})
	},

	qu(e) {
		var that = this;
		console.log(e);
		var id = e.currentTarget.dataset.id;
		console.log(id);
		wx.request({
			url: httpUrl.requestUrl + requestUrl.TwoIndex,
			data: {
				quyuid: id,
				fenleiid: that.data.fenleiid
			},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success(res) {
				console.log(res);
				that.setData({
					product: res.data.list,
					NavShow: !that.data.NavShow

				})
			}
		})
	},

	jiage(e) {
		var that = this;
		console.log(e);
		var jiage = e.currentTarget.dataset.jiage;
		console.log(jiage);
		wx.request({
			url: httpUrl.requestUrl + requestUrl.TwoIndex,
			data: {
				jiaGeS: jiage,
				fenleiid: that.data.fenleiid
			},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success(res) {
				console.log(res);
				that.setData({
					product: res.data.list,
					NavShow: !that.data.NavShow
				})
			}
		})
	},
	fangxing(e) {
		var that = this;
		console.log(e);
		var fangxing = e.currentTarget.dataset.fangxing;
		console.log(fangxing);
		wx.request({
			url: httpUrl.requestUrl + requestUrl.TwoIndex,
			data: {
				huxing: fangxing,
				fenleiid: that.data.fenleiid
			},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success(res) {
				console.log(res);
				that.setData({
					product: res.data.list,
					NavShow: !that.data.NavShow
				})
			}
		})
	},

	mianji(e) {
		var that = this;
		console.log(e);
		var jianmian = e.currentTarget.dataset.mianji;
		console.log(jianmian);
		wx.request({
			url: httpUrl.requestUrl + requestUrl.TwoIndex,
			data: {
				jianmian: jianmian,
				fenleiid: that.data.fenleiid
			},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success(res) {
				console.log(res);
				that.setData({
					product: res.data.list,
					NavShow: !that.data.NavShow
				})
			}
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

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (e) {
		console.log(e)
		var title = e.title;
		var fenleiid = e.id;
		this.setData({
			fenleiid: fenleiid
		})
		console.log(title)
		wx.setNavigationBarTitle({
			title: title,
		})
		this.ListFun(e);
		this.ListFunBanner();
		this.fourFun();
	},

	onReachBottom(e) {
		var that = this;
		that.setData({
			PageNum: that.data.PageNum + 1
		})

		if (that.data.PageNum >= that.data.totalPage) {
			wx.showToast({
				title: '加载完毕',
				icon: 'success'
			})
		} else {
			that.ListFun();
		}
		console.log(that.data.PageNum)
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},
})