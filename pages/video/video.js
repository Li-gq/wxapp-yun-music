// pages/video/video.js
import request from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navInfoList: [],// 导航栏信息列表
    navId: "",
    videoList: [],
    playVideoId: "",
    videoUpdateTime: [],
    triggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getNavInfoList();
    
  },
  async getNavInfoList(){
    const result = await request("/video/group/list");
    if(result.code === 200){
      let navInfoList = result.data.slice(0,15);
      let navId = result.data[0].id;
      this.setData({
        navInfoList,
        navId
      });
      wx.showLoading({
        title: '正在加载',
      });
      this.getVideoList();
      wx.hideLoading();
    }
  },
  changNav(event){
    let navId = event.currentTarget.dataset.id >>> 0;
    this.setData({
      navId
    });
    wx.showLoading({
      title: '正在加载',
    });
    // 获取视频列表信息
    this.getVideoList();
    wx.hideLoading();
    this.setData({
      videoUpdateTime: []
    });
    // 如何将scroll-view的滚动条调到最上端


  },
  async getVideoList(){
    let result = await request("/video/group",{id: this.data.navId});
    if(result.code === 200){
      let index = 0;
      let videoList =  result.datas.map(item => {
        item.id = index++;
        return item;
      });
      this.setData({
        videoList
      });
    }
  },
  // 控制视频播放按钮
  handleVideoPlay(event){
    // 解决视频同时播放的问题
    // if(!this.playVideo){
    //   let vid = event.currentTarget.id;
    //   let context =  wx.createVideoContext(vid);
    //   this.playVideo = {vid, context};
    // }else if(this.playVideo.vid === event.currentTarget.id){
    //   return;
    // }else{
    //   this.playVideo.context.seek(0);
    //   this.playVideo.context.stop();
    //   let vid = event.currentTarget.id;
    //   let context =  wx.createVideoContext(vid);
    //   this.playVideo = {vid, context};
    // }
    // 使用图片替换视频，单页面只存在一个视频
    let playVideoId = event.currentTarget.dataset.id;
    this.setData({
      playVideoId
    });
    // 这里有点小问题是，视频界面还没有显示出来，就开始创建频的上下文，会导致视频播放不了
    setTimeout(()=>{
      this.videoContext = wx.createVideoContext(playVideoId);
      this.videoContext.play();
      let palyItem = this.data.videoUpdateTime.find(item=>item.vid === playVideoId);
      this.videoContext.seek( palyItem ? palyItem.time : 0 );
    },200)
  },
  // 更新视频的播放时间
  handleVideoUpdataTime(event){
    let {videoUpdateTime} = this.data;
    let vid = event.currentTarget.id;
    let time = event.detail.currentTime;
    let updateIndex = videoUpdateTime.findIndex(item=>item.vid === vid);
    if(updateIndex === -1) {
      videoUpdateTime.push({vid, time});
    }else{
      videoUpdateTime.splice(updateIndex, 1, {vid, time});
    }
    this.setData({
      videoUpdateTime
    });
  },
  handleVideoEnd(event){
    let vid = event.currentTarget.id;
    let {videoUpdateTime} = this.data;
    let itmeIndex = videoUpdateTime.findIndex(item=>item.vid === vid);
    videoUpdateTime.splice(itmeIndex,1);
    this.setData({
      videoUpdateTime
    });
  },
  // 下拉刷新
  async pullDownRefersh(){
    await this.getVideoList(this.navId);
    this.setData({
      triggered: false
    });
  },
  // 上拉加载-这里是伪加载
  async pullUpLoad(){
    let {videoList} = this.data;
    if(videoList.length < 100){
      let result = await request("/video/group",{id: this.data.navId});
      if(result.code === 200){
        let index = videoList.lenght;
        let newVideoList =  result.datas.map(item => {
          item.id = index++;
          return item;
        });
        this.setData({
          videoList: [...videoList, ...newVideoList]
        });
      }
    }
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
  onShareAppMessage({from}) {
    if(from === "menu"){
      return {
        title: "来自菜单的转发",
        path: "/pages/video/video",
        imageUrl: "/static/images/wallhaven-g75r7d_1920x1080.jpg"
      };
    }else{
      return {
        title: "来自button的转发",
        path: "/pages/video/video",
        imageUrl: "/static/images/wallhaven-g75r7d_1920x1080.jpg"
      };
    }
  }
})