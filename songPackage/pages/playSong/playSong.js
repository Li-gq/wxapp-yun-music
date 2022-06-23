import request from "../../../utils/request";
import PubSub from "pubsub-js";
import moment from "moment";

var appInstance = getApp();
// pages/playSong/playSong.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    songInfo: {},
    playUrl: "",
    currentTime: "00:00",
    durationTime: "00:00",
    currentWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let {musicId} = options;
    musicId = musicId >>> 0;
    this.getSongInfo(musicId);
    if(appInstance.globalData.isPlay === true && appInstance.globalData.musicId === musicId){
      this.setData({
        isPlay: true
      });
    }
    // 切歌后获取的musicId
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    PubSub.subscribe("musicId",async (msg,musicId)=>{
      this.backgroundAudioManager.stop();
      await this.getSongInfo(musicId);
      this.setData({
        musicId,
        isPlay: true
      });
      await this.handleBackgroundAudioPlay(true, musicId, "");
    });
    // 监听后台音乐的播放，暂停和结束
    this.backgroundAudioManager.onPlay(()=>{
      this.handlePlayState(true);
      appInstance.globalData.isPlay = true;
    });
    this.backgroundAudioManager.onPause(()=>{
      this.handlePlayState(false);
    });
    this.backgroundAudioManager.onStop(()=>{
      this.handlePlayState(false);
    });
    // 结束后进入下一首
    this.backgroundAudioManager.onEnded(()=>{
      PubSub.publish("switchSong", "next");
      this.setData({
        currentTime: "00:00",
        currentWidth: 0
      });
    });
    // 实时监视进度条，改变进度条
    this.backgroundAudioManager.onTimeUpdate(()=>{
      let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format("mm:ss");
      let currentWidth = (this.backgroundAudioManager.currentTime*1000) / (this.data.songInfo.dt) * 400;
      this.setData({
        currentTime,
        currentWidth
      });
    });
  },
  // 获取歌曲信息
  async getSongInfo(musicId){
    let result = await request("/song/detail",{ids: musicId});
    if(result.code === 200){
      this.setData({
        songInfo: result.songs[0],
        durationTime: moment(result.songs[0].dt).format("mm:ss")
      });
      wx.setNavigationBarTitle({
        title: this.data.songInfo.name
      });
    }
  },
  // 点击播放和暂停的逻辑
  handleIsPlay(){
    let {isPlay} = this.data;
    this.setData({
      isPlay: !isPlay
    });
    this.handlePlayState(!isPlay);
    this.handleBackgroundAudioPlay(!isPlay, this.data.songInfo.id, this.data.playUrl);
  },
  // 控制播放和暂停状态的功能函数
  handlePlayState(isPlay){
    this.setData({
      isPlay
    });
    appInstance.globalData.isPlay = isPlay;
  },
  // 控制背景音乐的播放/暂停
  async handleBackgroundAudioPlay(isPlay, musicId, playUrl){
    // 获取播放地址
    if(isPlay){
      if(!playUrl){
        let result = await request("/song/url",{id: musicId});
        playUrl = result.data[0].url;
        this.setData({
          playUrl
        });
      }
      let {songInfo} = this.data;
      this.backgroundAudioManager.src = playUrl;
      this.backgroundAudioManager.title = songInfo.name;
    }else{
      this.backgroundAudioManager.pause();
    }
    appInstance.globalData.isPlay = isPlay;
    appInstance.globalData.musicId = musicId;
  },
  handleSwitch(event){
    let type = event.currentTarget.dataset.type;
    if(type === 'prev'){
      PubSub.publish('switchSong', "prev");
    }else{
      PubSub.publish('switchSong', "next");
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
  onShareAppMessage() {

  }
})