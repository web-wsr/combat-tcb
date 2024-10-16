// pages/detail/detail.js
// 引用全局对象
let APP = getApp();
const db = wx.cloud.database();
import { formatTime } from '../../utils/formatTime.js';
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    id: '',
    topic: {},
    fullScreen: false,
    message:'',
    replies: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options);
    this.getTopics(options.id)
    this.getReplies(options.id)
    // 顺序问题
    this.getUserInfo()
    
    
  },
  getTopics: function(id){
    db.collection('topic').doc(id).get({
      success: (res) => {
        // console.log(res);
        let topic = res.data
        this.setData({
          id,
          topic
        })
      }
    })
  },
   // 当用户点击图片时候，获取当前图片元素中 data-url 设置的图片地址
  // 然后使用 wx.previewImage API 预览展示。
  handlePreviewImage: function(event){
    // console.log(event);
    let url = event.currentTarget.dataset.url
    wx.previewImage({
      urls: [url],
      current: url
    })
  },
  // 当用户点击视频的 cover-view 时候，获取元素中 data-id 的 id 值
  handlePreviewVideo: function(event){
    let id = event.currentTarget.dataset.id
    let videoCtx = wx.createVideoContext(id)
    let fullScreen = this.data.fullScreen
    if(fullScreen){
      videoCtx.pause()
      videoCtx.exitFullScreen()
      this.setData({ fullScreen: false })
    }else{
      videoCtx.requestFullScreen()
      videoCtx.play()
      this.setData({ fullScreen: true })
    }
  },
  getUserInfo: function(){
    let userInfo = APP.globalData.cur_user
    if(userInfo.user_nickName){
      this.setData({ userInfo: userInfo})
    }else{
      return
    }
  },
  // 去 我的 页面重新登录
  handleLogin:function(){
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  handleChange: function(event){
    let message = event.detail.value
    this.setData({ message })
  },
  handleSubmit: function(event){
    let date = new Date()
    let content = this.data.message
    let userInfo = APP.globalData.cur_user
    let date_display = formatTime(date)
    let createTime = db.serverDate()
    let topic_id = this.data.id
    let replies = this.data.replies
    if(!content){
      wx.showToast({
        title: '评论不能为空',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '评论中...',
      mask: true
    })
    db.collection('reply').add({
      data: {
        content, userInfo, date_display, createTime, topic_id
      },
      success: res => {
          wx.showToast({
            title: '评论成功',
          })
          // 调用递增的方法
          this.incReply(topic_id)
          replies.unshift({
            content, userInfo, date_display, createTime, topic_id
          })
          this.setData({ replies, message: ''})
      },
      fail: error => {
        wx.showToast({
          title: '评论失败',
          icon: none
        })
        console.log('[数据库]新增记录失:', error );
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  getReplies: function(id){
    console.log(id);
    db.collection('reply').orderBy('createTime', 'desc').where({
      topic_id: id
    }).get({
      success: (res) => {
        let replies = res.data;
        this.setData({ replies, id })
      },
      fail: error =>{
        console.log(error);
      }
    })
  },
  // 回复数递增
  incReply: function(topic_id){
    wx.cloud.callFunction({
      name: 'incReply',
      data: {
        topic_id: topic_id
      },
      success: res =>{
        console.log('[云函数] [addReply] user openid: ', res.result)
      },
      fail: error => {
        console.error('[云函数] [addReply] 调用失败', err)
      }
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