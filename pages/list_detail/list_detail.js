// pages/list_detail/list_detail.js
let httpUrl = require("../../utils/api.js");
let requestUrl = require("../../utils/request.js");

var app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		dataId: null,
		loupanid: '',
		Img: "",
		flag: false,
		flags: false,
		// 默认轮播图
		DetailSwiper: [],
		codeImgs: null,
		proImgs: null,
		DetailName: null,
	},

	// 请求二维码
	qrCode() {
		var that = this;
		wx.getStorage({
			key: 'UserId',
			success(user) {
				// 存储当前用户id
				var userId = user.data
				console.log("用户id:" + userId);
				console.log("id:" + that.data.loupanid);

				wx.request({
					url: httpUrl.requestUrl + requestUrl.qrCode,
					data: {
						path: "pages/list_detail/list_detail",
						scene: "userId=" + userId + ",id=" + that.data.loupanid,
					},
					method: "POST",
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					success(res) {
						console.log(res);
						that.setData({
							codeImgs: res.data
						})
					},
					fail() {
						wx.showToast({
							title: '二维码请求失败',
							icon: 'none'
						})
					}
				})
			}
		})

	},
	// 点击生成图片
	poster() {
		this.setData({
			flag: !this.data.flag,
			flags: !this.data.flags
		})
		this.animationHide();
		this.shareCanvas();
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (e) {
		console.log(e);
		var that = this;
		var scene = decodeURIComponent(e.scene);
		if (!scene == "") {
			var scenes = scene.split(",");
			console.log(scenes.length);

			var list = new Map();
			for (var i = 0; i < scenes.length; i++) {
				list.set(scenes[i].split("=")[0], scenes[i].split("=")[1]);
			}
			if (!list.get("id") == "") {
				that.setData({
					loupanid: list.get("id")
				})
				that.qrCode();
				that.animationHide();
				that.LouPanDetail(e);
			}
			if (!list.get("userId") == "") {
				wx.setStorage({
					data: list.get("userId"),
					key: 'Loginid',
				})
				that.tuijian(list.get("userId"));
			}
		}
		if (!e.userid == "") {
			wx.setStorage({
				data: e.userid,
				key: 'Loginid',
			})
			that.tuijian(e.userid);

		}

		if (!e.id == "") {
			that.setData({
				loupanid: e.id
			})
			that.qrCode();
			that.animationHide();
			that.LouPanDetail(e);
		}
	},
	tuijian(tuijianrenid) {
		wx.getStorage({
			key: 'UserId',
			success(res) {
				var userid = res.data;
				console.log("tuijianrenid:" + tuijianrenid);
				console.log("userid:" + userid);
				if (userid != "") {
					console.log("提交");
					wx.request({
						url: httpUrl.requestUrl + requestUrl.setTuiJianRen,
						data: {
							userid: userid,
							tuiJianRen: tuijianrenid
						},
						method: 'POST',
						header: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						success: res => {
							if (res.data.success == "true") {
								wx.showToast({
									title: "已建立关系",
									icon: 'none'
								});
							} else {
								if (res.data.msg != "") {
									wx.showToast({
										title: res.data.msg,
										icon: 'none'
									});
								}
							}
						}
					})
				}
			}
		});
	},

	shareCanvas() {
		wx.showToast({
			title: '请稍后',
			icon: 'none'
		})
		var rpx;
		wx.getSystemInfo({
			success(res) {
				rpx = res.windowWidth / 375;
			}
		})
		var that = this;
		// 二維碼圖片
		var codeImg = that.data.codeImgs;
		// 产品图片
		var proImg = that.data.proImgs;
		// 礼盒图片
		var liImg = "https://cmei.dmeit.cn/lihe.png";
		wx.getImageInfo({
			src: codeImg,
			success(res1) {
				wx.getImageInfo({
					src: proImg,
					success(res2) {
						wx.getImageInfo({
							src: liImg,
							success(res3) {
								// 使用canvas开始画图片
								var ctx = wx.createCanvasContext('ctx');
								ctx.fillStyle = "#fff";
								ctx.fillRect(0, 0, 293 * rpx, 795 * rpx);
								// 二维码图
								ctx.drawImage(res1.path, 0, 0, res1.path.width, res1.path.height, 180 * rpx, 260 * rpx, 100 * rpx, 100 * rpx);
								// 背景
								ctx.drawImage(res2.path, 0, 0, res2.path.width, res2.path.height, 0, 0, 290 * rpx, 180 * rpx);
								// 礼盒
								ctx.drawImage(res3.path, 0, 0, res3.path.width, res3.path.height, 20 * rpx, 253 * rpx, 20 * rpx, 20 * rpx);
								// 设置楼盘名称字体颜色
								ctx.setFillStyle("#06478F");
								ctx.setFontSize(18 * rpx);
								ctx.fillText(that.data.DetailName, 20 * rpx, 220 * rpx);
								// 设置到访有礼字体颜色
								ctx.setFillStyle("#FF2712");
								ctx.setFontSize(16 * rpx);
								ctx.fillText("到访有礼", 42 * rpx, 270 * rpx);
								// 设置扫码提示字体颜色
								ctx.setFillStyle("#666");
								ctx.setFontSize(12 * rpx);
								ctx.fillText("长按识别小程序码使用", 20 * rpx, 320 * rpx);
								// 设置房汇通字体颜色
								ctx.setFontSize(10 * rpx);
								ctx.fillText("房惠通", 20 * rpx, 340 * rpx);
								// 加一行文字
								console.log(res1.path)
								console.log(res2.path)
								ctx.draw(false, () => {
									wx.canvasToTempFilePath({
										canvasId: 'ctx',
										destWidth: 650,
										destHeight: 900,
										fileType: 'jpg',
										success(canres) {
											console.log(canres)
											that.setData({
												Img: canres.tempFilePath
											});
										},
									})
								});
							}
						})
					},
				})
			}
		})
	},

	saveFun() {
		wx.saveImageToPhotosAlbum({
			filePath: this.data.Img,
			success(saves) {
				wx.showToast({
					title: '保存成功',
					icon: 'success'
				})
			}
		})
	},


	// 请求产品数据
	LouPanDetail(e) {
		var that = this;
		wx.request({
			url: httpUrl.requestUrl + requestUrl.getLouPanTwo,
			method: 'POST',
			data: {
				id: that.data.loupanid
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success(res) {
				console.log(res);
				var time = res.data.louPan.kaipan;
				var Datetime = new Date(time);
				var timeZhuan = Datetime.getFullYear() + '-' + (Datetime.getMonth() + 1) + '-' + Datetime.getDate();
				console.log(timeZhuan);

				that.setData({
					DetailSwiper: res.data.louPan.LP_TP_list,
					DetailName: res.data.louPan.name,
					DetailNameF: res.data.louPan.bieming,
					lable: res.data.louPan.biaoqians,
					shoujia: res.data.louPan.shoujia,
					huxing: res.data.louPan.huxing,
					leixing: res.data.louPan.fenLei.name,
					jianmian: res.data.louPan.jianmian,
					shijian: timeZhuan,
					maps: res.data.louPan.dizhi,
					yongjin: res.data.louPan.yongjin,
					phone: res.data.louPan.dianhua,
					dataId: res.data.louPan.id,
					jieshao: res.data.louPan.jieshao.replace(/\<img/gi, '<img style="max-width:100%;height:auto"'),
					proImgs: res.data.louPan.zhutu,
					yongjinjieshao: res.data.louPan.yongjinjieshao
				})
			}
		})
	},
	// 点击到访有礼
	lipin(e) {
		var id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '../visit/visit?id=' + id,
		})
	},

	// 点击成交佣金
	yongjin(e) {
		console.log(e)
		var id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '../charges/charges?id=' + id,
		})
	},
	// 点击拨打电话
	phoneFun(e) {
		console.log(e)
		var iphone = e.currentTarget.dataset.iphone;
		wx.makePhoneCall({
			phoneNumber: iphone,
		})
	},
	// 地图
	mapFun(e) {
		console.log(e)
		// 获取当前位置
		var map = e.currentTarget.dataset.mapname;
		wx.getLocation({
			type: 'gcj02', // 返回可以用于wx.openLocation的经纬度-
			success(res) {
				type: "gcj02"
				console.log(res);
				// 纬度
				var latitude = res.latitude;
				// 精度
				var longitude = res.longitude;
				wx.openLocation({
					latitude: latitude,
					longitude: longitude,
					name: map,
					address: map,
					scale: 18
				})
			},
			fail(res) {
				wx.showToast({
					title: '定位失败',
					icon: 'none'
				})
			}
		})
	},

	// 弹出动画
	animationShow() {
		var animation = wx.createAnimation({
			duration: 300,
			delay: 0,
			timingFunction: 'linear'
		});
		this.animation = animation;
		animation.translateY(0).step();
		this.setData({
			animation: animation.export()
		})
	},

	animationHide() {
		var animation = wx.createAnimation({
			duration: 0,
			delay: 0,
			timingFunction: 'linear'
		});
		this.animation = animation;
		animation.translateY(300).step();
		this.setData({
			animation: animation.export()
		})
	},

	shareFun() {
		var that = this;
		wx.getStorage({
			key: 'UserState',
			success(res) {
				var UserZt = res.data;
				if (UserZt) {
					that.animationShow();
					that.setData({
						flag: !that.data.flag
					})
				} else {
					wx.showToast({
						title: '请先授权',
						icon: 'none'
					})
				}
			}
		})

	},

	// 关闭弹出
	close() {
		this.animationHide();
		this.setData({
			flag: false,
			flags: false
		})
	},

	onShareAppMessage: function () {
		var userid = wx.getStorageSync('UserId')
		console.log(userid)
		return {
			title: this.data.DetailName,
			path: 'pages/list_detail/list_detail?id=' + this.data.loupanid + '&userid=' + userid,
		}
	},

	// 预约
	orderFun(e) {
		console.log(e);
		var id = e.currentTarget.dataset.id;
		console.log(id)
		var title = e.currentTarget.dataset.title;
		wx.getStorage({
			key: 'UserState',
			success(res) {
				var UserState = res.data;
				if (UserState == true) {
					console.log("yes");
					wx.navigateTo({
						url: '../order_detail/order_detail?title=' + title + '&id=' + id,
					})
				} else {
					wx.showToast({
						title: '请先授权',
						icon: 'none'
					});
					wx.reLaunch({
						url: '../user/user',
					})
				}
			}
		})


	},

})