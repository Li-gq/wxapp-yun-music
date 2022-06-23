import request from "../../utils/request";

let startY = 0;
let endY = 0;
let distanceY = 0;
// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: "",
    coveTransition: "",
    userInfo: {},
    recentPlayList: [],
  },
  handleTouchStart(event){
    this.setData({
      coveTransition:""
    });
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event){
    endY = event.touches[0].clientY;
    distanceY = endY - startY;
    if(distanceY > 80){
      distanceY = 80;
    }
    if(distanceY < 0){
      return;
    }
    this.setData({
      coverTransform: `translateY(${distanceY}rpx)`
    });
  },
  handleTouchEnd(event){
    this.setData({
      coverTransform:"",
      coveTransition: "transform 0.5s ease"
    });
  },
  toLogin(){
    const {userInfo} = this.data;
    if(userInfo.nickname) return;
    wx.navigateTo({
      url: '/pages/login/login',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        userInfo
      });
    }
    // 获取最近播放
    this.getRecentPlayList(this.data.userInfo.userId);
    
  },
  async getRecentPlayList(userId){
    if(this.data.userInfo.userId){
      // /user/record?uid=32953014&type=1
      const result = await request("/user/record",{uid:userId, type:0});
      if(result.code === 200){
        const recentPlayList = result.allData.slice(0,10).map(item=>{
          return {picUrl:item.song.al.picUrl,id:item.song.id};
        });
        this.setData({
          recentPlayList
        });
      }
    }
  },

  // 退出登录
  logout(){
    this.setData({
      userInfo: {},
      recentPlayList: []
    });
    wx.clearStorage({
      success: (res) => {
        wx.showToast({
          title: '已退出登录',
        });
      },
    })
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