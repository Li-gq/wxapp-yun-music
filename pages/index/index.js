// pages/index/index.js
import request from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [], // 轮播图数据
    recommendList:[],
    rankList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 发请求获取banner图片
    this.getBanners();
    this.getReommendList();
    this.getRankList();
  },
  async getBanners(){
    let result = await request("/banner", {type: 2});
    this.setData({
      banners: result.banners
    });
  },
  async getReommendList(){
    const result = await request("/personalized", {limit: 10});
    if(result.code === 200){
      this.setData({
        recommendList: result.result
      });
    }
  },
  async getRankList(){
    let idx = 0;
    let resultArr = [];
    // const result = await request("/top/list",{idx: 0});
    // 这里使用定时器是为了防止验证，真实情况下不会这样破坏用户体验的
    while(idx < 5){
      const result = await request("/top/list",{idx: idx++});
      if(result.code === 200){
        resultArr.push({name: result.playlist.name, tracks:result.playlist.tracks.slice(0,3)});
        // 更新状态放在循环里面，好处是用户等待时间短，坏处是更新频繁
        this.setData({
          rankList: resultArr
        });
      }
    }
    // setTimeout(async()=>{
    //   while(idx < 5){
    //     const result = await request("/top/list",{idx: idx++});
    //     if(result.code === 200){
    //       resultArr.push({name: result.playlist.name, tracks:result.playlist.tracks.slice(0,3)});
    //       // 更新状态放在循环里面，好处是用户等待时间短，坏处是更新频繁
    //       this.setData({
    //         rankList: resultArr
    //       });
    //     }
    //   }
    // },2000);
  },
  toRecommend(){
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong',
    });
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