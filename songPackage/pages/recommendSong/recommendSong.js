// pages/recommendSong/recommendSong.js
import request from "../../../utils/request";
import PubSub from "pubsub-js";



Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: "",
    month: "",
    recommendList: [],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    });
    this.getRecommendList();

    // 切歌
    PubSub.subscribe("switchSong", (msg,type)=>{
      let {index} = this.data;
      if(type === "prev"){
        index -= 1;
        if(index < 0) index = this.data.recommendList.length - 1;
      }else{
        index += 1;
        if(index >= this.data.recommendList.length) index = 0;
      }
      this.setData({
        index
      });
      // 将新的musicId发布
      PubSub.publish("musicId", this.data.recommendList[index].id);
    });
    
  },
  async getRecommendList(){
    let result = await request("/recommend/songs");
    if(result.code === 200){
      this.setData({
        recommendList: result.recommend
      });
    }
  },
  toPlaySong(event){
    let {id:musicId, index} = event.currentTarget.dataset;
    this.setData({
      index
    });
    wx.navigateTo({
      url: '/songPackage/pages/playSong/playSong?musicId=' + musicId,
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