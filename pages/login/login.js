// pages/login/login.js
import request from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 通过一个函数收集所有表单数据
  handleInput(event){
    let type = event.currentTarget.dataset.type;
    let value = event.detail.value;
    this.setData({
      [type]:value
    });
  },
  async login(){
    // 登录的逻辑
    let {phone, password} = this.data;
    // 两行伪代码
    // phone = "15711140593";
    // password = "123456yzy";
    if(!phone){
      wx.showToast({
        title: '号码不能为空',
        icon: "error"
      });
      return;
    }
    const phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '号码格式错误',
        icon: "error"
      });
      return;
    }
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon: "error"
      });
      return;
    }
    // 后端验证
    let result = await request("/login/cellphone",{phone,password,isLogin:true});
    // 200, 400, 502
    if(result.code === 200){
      wx.showToast({
        title: '登录成功',
      });
      // 登录成功做什么
      wx.setStorageSync('userInfo', result.profile);
      wx.reLaunch({
        url: '/pages/personal/personal',
      });

    }else if(result.code === 400){
      wx.showToast({
        title: '手机格式错误',
        icon: "error"
      });
    }else if(result.code === 502){
      wx.showToast({
        title: '密码错误',
        icon: "error"
      });
    }else{
      wx.showToast({
        title: '登录失败',
        icon: "error"
      })
    }
    // 思考登录失败后，如何清空表单中的数据
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})